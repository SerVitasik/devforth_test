<template>
  <div class="shadow-md p-5 mb-5 h-[200px] flex flex-col justify-center items-center">
    <div v-if="isRolling" class="text-center text-xl font-bold">
      Rolling...
    </div>
    <div v-else class=" flex justify-center items-center gap-3">
      <div v-for="(die, index) in diceValues" :key="index">
        <span v-if="die === '?'" class="text-3xl font-bold border border-[4px] rounded-md border-black flex justify-center items-center w-16 h-16">?</span>
        <img v-else :src="getDiceImage(die as number)" :alt="'Dice ' + die" class="w-20 h-20" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Dice1 from '../assets/dice-1.svg';
import Dice2 from '../assets/dice-2.svg';
import Dice3 from '../assets/dice-3.svg';
import Dice4 from '../assets/dice-4.svg';
import Dice5 from '../assets/dice-5.svg';
import Dice6 from '../assets/dice-6.svg';

export default defineComponent({
  props: {
    diceValues: {
      type: Array,
      required: true,
    },
    isRolling: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const getDiceImage = (dieValue: number) => {
      const diceImages = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
      return diceImages[dieValue - 1];
    };

    return {
      diceValues: computed(() => props.diceValues),
      getDiceImage,
    };
  },
});
</script>