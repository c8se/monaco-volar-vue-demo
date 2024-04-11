export const fsMap: Record<string, string> = {
  '/src/main.ts': `import { createApp } from 'vue'
import AppVue from './AppVue.vue'

createApp(AppVue).mount('#app')`,

  '/src/App.vue': `<template>
<div class="app">
  <Hello :msg="msg" />
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Hello from './Hello.vue'

const msg = ref('foo')
</script>
  `,

  '/src/Hello.vue': `<template>
<div class="row">
  hello {{ msg }}
</div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ msg: string }>()
</script>
<style scoped>
.row {
  background: #408;
}
</style>
`
}
