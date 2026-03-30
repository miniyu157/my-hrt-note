<template>
  <div class="vp-raw needle-calc-wrapper">
    <div class="calc-panel">
      <div class="input-grid">
        <div class="input-group">
          <label for="pinch-input">捏起皮肤厚度 (cm)</label>
          <div class="input-control">
            <input
              id="pinch-input"
              type="number"
              v-model.number="pinchThickness"
              min="0.5"
              max="6.0"
              step="0.1"
            />
            <span class="unit">cm</span>
          </div>
        </div>
        <div class="input-group">
          <label for="depth-input">预期最少刺入深度 (cm)</label>
          <div class="input-control">
            <input
              id="depth-input"
              type="number"
              v-model.number="minMuscleDepth"
              min="0.5"
              max="3.0"
              step="0.1"
            />
            <span class="unit">cm</span>
          </div>
        </div>
      </div>
      <br />
      <ul class="trace-list">
        <li>
          <span class="trace-label">皮下脂肪厚度</span>
          <span class="trace-math">
            {{ safeThickness.toFixed(1) }} ÷ 2 = <strong>{{ fatThickness.toFixed(2) }} cm</strong>
          </span>
        </li>
        <li>
          <span class="trace-label">目标进针深度</span>
          <span class="trace-math">
            {{ fatThickness.toFixed(2) }} + {{ safeMuscleDepth.toFixed(1) }}(肌肉穿透) = <strong>{{ targetDepth.toFixed(2) }} cm</strong>
          </span>
        </li>
        <li>
          <span class="trace-label">最低要求针长</span>
          <span class="trace-math">
            {{ targetDepth.toFixed(2) }} + {{ SAFETY_MARGIN_CM }}(最低预留底线) = <strong>{{ minRequiredLength_cm.toFixed(2) }} cm ({{ minRequiredLength_mm.toFixed(1) }} mm)</strong>
          </span>
        </li>
      </ul>
    </div>

    <div class="calc-panel table-panel">
      <div class="rec-header">
        <span>可用针头方案列表</span>
        <div class="filter-control" v-if="globalMaxDia > 0">
          <span class="filter-label">直径: {{ filterMinDia.toFixed(2) }} - {{ filterMaxDia.toFixed(2) }} mm</span>
          <div class="dual-slider">
            <div class="slider-track">
              <div
                class="slider-range"
                :style="{ left: percentMin + '%', width: percentWidth + '%' }"
              ></div>
            </div>
            <input
              type="range"
              :min="globalMinDia"
              :max="globalMaxDia"
              step="0.05"
              v-model.number="filterMinDia"
              @input="handleMin"
            />
            <input
              type="range"
              :min="globalMinDia"
              :max="globalMaxDia"
              step="0.05"
              v-model.number="filterMaxDia"
              @input="handleMax"
            />
          </div>
        </div>
      </div>
      <div class="table-container" v-if="recommendedNeedles.length">
        <table>
          <thead>
            <tr>
              <th>规格</th>
              <th>颜色</th>
              <th>直径</th>
              <th>长度</th>
              <th>安全预留</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="needle in recommendedNeedles"
              :key="`${needle.gauge}-${needle.length}`"
            >
              <td><strong>{{ needle.gauge }}G</strong> ({{ needle.number }}号)</td>
              <td>
                <div class="color-badge">
                  <span class="color-dot" :style="{ backgroundColor: needle.colorHex }"></span>
                  {{ needle.colorName }}
                </div>
              </td>
              <td>{{ needle.diameter }} mm</td>
              <td><strong>{{ needle.length }} mm</strong></td>
              <td>{{ needle.reserve_cm }} cm ({{ needle.reserve_mm }} mm)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">无符合当前要求的针头。</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const SAFETY_MARGIN_CM = 0.1

const pinchThickness = ref(2.4)
const minMuscleDepth = ref(1.0)

const safeThickness = computed(() => Math.max(0.5, Math.min(Number(pinchThickness.value) || 0.5, 10)))
const safeMuscleDepth = computed(() => Math.max(0.1, Math.min(Number(minMuscleDepth.value) || 1.0, 5)))

const fatThickness = computed(() => safeThickness.value / 2)
const targetDepth = computed(() => fatThickness.value + safeMuscleDepth.value)
const minRequiredLength_cm = computed(() => targetDepth.value + SAFETY_MARGIN_CM)
const minRequiredLength_mm = computed(() => minRequiredLength_cm.value * 10)

const isoNeedleSpecs = [
  { gauge: 27, diameter: 0.4, number: 4, colorName: '中灰色', colorHex: '#808080', availableLengths: [13, 16, 20] },
  { gauge: 26, diameter: 0.45, number: 4.5, colorName: '褐色', colorHex: '#8B4513', availableLengths: [13, 16, 20] },
  { gauge: 25, diameter: 0.5, number: 5, colorName: '橙色', colorHex: '#F26D21', availableLengths: [16, 20, 25] },
  { gauge: 24, diameter: 0.55, number: 5.5, colorName: '紫色', colorHex: '#800080', availableLengths: [20, 25] },
  { gauge: 23, diameter: 0.6, number: 6, colorName: '深蓝色', colorHex: '#00008B', availableLengths: [25, 30] },
  { gauge: 22, diameter: 0.7, number: 7, colorName: '黑色', colorHex: '#1A1A1A', availableLengths: [30, 38] },
  { gauge: 21, diameter: 0.8, number: 8, colorName: '深绿色', colorHex: '#006400', availableLengths: [38, 40] },
  { gauge: 20, diameter: 0.9, number: 9, colorName: '黄色', colorHex: '#FFFF00', availableLengths: [25, 30, 38] },
  { gauge: 19, diameter: 1.1, number: 11, colorName: '乳白色', colorHex: '#FFFFF0', availableLengths: [30, 38, 40] },
  { gauge: 18, diameter: 1.2, number: 12, colorName: '粉红色', colorHex: '#FFC0CB', availableLengths: [38, 40, 50] }
]

const baseValidNeedles = computed(() => {
  const requiredMm = minRequiredLength_mm.value
  const targetCm = targetDepth.value
  const results = []

  for (const spec of isoNeedleSpecs) {
    for (const length of spec.availableLengths) {
      if (length >= requiredMm) {
        const reserveCm = length / 10 - targetCm
        results.push({
          ...spec,
          length,
          reserve_cm: reserveCm.toFixed(2),
          reserve_mm: (reserveCm * 10).toFixed(1)
        })
      }
    }
  }
  return results.sort((a, b) => a.diameter - b.diameter || a.length - b.length)
})

const globalMinDia = ref(0)
const globalMaxDia = ref(0)
const filterMinDia = ref(0)
const filterMaxDia = ref(0)

watch(baseValidNeedles, (newPool) => {
  if (!newPool.length) {
    globalMinDia.value = 0
    globalMaxDia.value = 0
    filterMinDia.value = 0
    filterMaxDia.value = 0
    return
  }

  const allDias = newPool.map(n => n.diameter)
  globalMinDia.value = Math.min(...allDias)
  globalMaxDia.value = Math.max(...allDias)

  const top5Dias = newPool.slice(0, 5).map(n => n.diameter)
  filterMinDia.value = Math.min(...top5Dias)
  filterMaxDia.value = Math.max(...top5Dias)
}, { immediate: true })

const percentMin = computed(() => {
  if (globalMaxDia.value === globalMinDia.value) return 0
  return ((filterMinDia.value - globalMinDia.value) / (globalMaxDia.value - globalMinDia.value)) * 100
})

const percentWidth = computed(() => {
  if (globalMaxDia.value === globalMinDia.value) return 100
  return ((filterMaxDia.value - filterMinDia.value) / (globalMaxDia.value - globalMinDia.value)) * 100
})

const handleMin = () => {
  if (filterMinDia.value > filterMaxDia.value) filterMinDia.value = filterMaxDia.value
}

const handleMax = () => {
  if (filterMaxDia.value < filterMinDia.value) filterMaxDia.value = filterMinDia.value
}

const recommendedNeedles = computed(() => {
  return baseValidNeedles.value.filter(
    n => n.diameter >= filterMinDia.value && n.diameter <= filterMaxDia.value
  )
})
</script>

<style scoped>
.needle-calc-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  font-family: var(--vp-font-family-base, system-ui, sans-serif);
}

.calc-panel {
  background-color: var(--vp-c-bg-soft, #f9f9f9);
  border: 1px solid var(--vp-c-border, #e5e5e5);
  border-radius: 6px;
  padding: 16px;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1, #333);
}

.input-control {
  position: relative;
  display: flex;
  align-items: center;
}

.input-control input {
  width: 100%;
  padding: 6px 32px 6px 10px;
  border: 1px solid var(--vp-c-divider, #ccc);
  border-radius: 4px;
  background-color: #ffffff;
  color: var(--vp-c-text-1, #333);
  font-size: 14px;
  outline: none;
}

.input-control input:focus {
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.input-control .unit {
  position: absolute;
  right: 10px;
  font-size: 13px;
  color: var(--vp-c-text-2, #666);
  pointer-events: none;
}

.trace-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trace-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  border-bottom: 1px dashed var(--vp-c-divider, #ccc);
  padding-bottom: 8px;
}

.trace-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.trace-label {
  color: var(--vp-c-text-2, #666);
}

.trace-math {
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--vp-c-text-1, #333);
}

.trace-math strong {
  color: var(--vp-c-brand-1, #3eaf7c);
}

.table-panel {
  padding: 0;
  overflow: hidden;
}

.rec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1, #333);
  padding: 12px 16px;
  background-color: var(--vp-c-bg-alt, #f0f0f0);
  border-bottom: 1px solid var(--vp-c-border, #e5e5e5);
}

.filter-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 12px;
  font-weight: normal;
  color: var(--vp-c-text-2, #666);
  font-variant-numeric: tabular-nums;
}

.dual-slider {
  position: relative;
  width: 120px;
  height: 20px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: var(--vp-c-divider, #ccc);
  border-radius: 2px;
  z-index: 1;
}

.slider-range {
  position: absolute;
  height: 100%;
  background-color: var(--vp-c-brand-1, #3eaf7c);
  border-radius: 2px;
}

.dual-slider input[type="range"] {
  position: absolute;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  z-index: 2;
  margin: 0;
}

.dual-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  cursor: grab;
}

.dual-slider input[type="range"]::-webkit-slider-thumb:active {
  cursor: grabbing;
}

.dual-slider input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid var(--vp-c-brand-1, #3eaf7c);
  cursor: grab;
}

.dual-slider input[type="range"]::-moz-range-thumb:active {
  cursor: grabbing;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
  margin: 0;
}

th,
td {
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider, #ccc);
  white-space: nowrap;
}

th:last-child,
td:last-child {
  width: 100%;
  white-space: normal;
}

th {
  font-weight: 600;
  color: var(--vp-c-text-2, #666);
  background-color: var(--vp-c-bg-soft, #f9f9f9);
}

tr:last-child td {
  border-bottom: none;
}

.color-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-2, #666);
}
</style>
