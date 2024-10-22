<template>
  <div class="shadow-md p-5">
    <ul class="flex flex-col gap-2 justify-center">
      <li 
        v-for="(result, index) in possibleResults" 
        :key="index"
        :class="[{ 'text-red-600': result.name === resultMessage }, 'flex justify-between font-bold']">
        {{ result.name }}
        <span>{{ result.multiplier }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  props: {
    resultMessage: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const possibleResults = ref([
      { name: "Balut", multiplier: "4x" },
      { name: "Straight", multiplier: "5x" },
      { name: "Full house", multiplier: "3x" },
      { name: "Pair", multiplier: "2x" },
      { name: "No special combination", multiplier: "0x" },
    ]);

    return {
      possibleResults,
      resultMessage: computed(() => props.resultMessage),
    };
  }
});
</script>