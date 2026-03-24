<template>
  <div class="custom-disclaimer">
    <p class="custom-disclaimer-title">！免责声明</p>
    <p>本指南仅代表个人经验与主观观点，绝不构成任何专业医疗建议。任何关于药物的使用、剂量调整等决定，请务必遵从专业医师的指导。阅读并参考本站内容即代表您同意自行承担相关风险。</p>
  </div>
</template>

<style scoped>
.custom-disclaimer {
  margin: 2.5rem 0;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-custom-block-warning-bg);
  border: 1px solid var(--vp-custom-block-warning-border);
  color: var(--vp-custom-block-warning-text);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.custom-disclaimer-title {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 1rem;
}

.custom-disclaimer p:last-child {
  margin: 0;
}
</style>
