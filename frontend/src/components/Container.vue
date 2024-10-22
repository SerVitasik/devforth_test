<template>
  <div class="mt-10 max-w-[600px] mx-auto h-screen">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Container',
  setup() {
    return {};
  },
});
</script>