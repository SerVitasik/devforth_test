<template>
  <div class="shadow-md p-5">
    <h3 class="text-xl font-bold text-center mb-5">Bet</h3>
    <div class="flex justify-center gap-4">
      <input
        type="number"
        v-model="betAmountLocal"
        placeholder="Enter your bet"
        class="border border-gray-300 p-2 rounded-lg max-w-[100px]"
      />
      <button
        :class="[
          'text-white font-bold py-2 px-4 rounded',
          isRolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-700'
        ]"
        @click="rollDice"
        :disabled="isRolling"
      >
        {{ isRolling ? 'Rolling...' : 'Roll Dice' }}
      </button>
    </div>
    <div class="mt-5 font-bold flex flex-col items-center justify-center gap-4">
      <span>Your balance</span>
      <span>{{ balance }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    betAmount: Number,
    balance: Number,
    isRolling: Boolean,
  },
  setup(props, { emit }) {
    const betAmountLocal = ref(props.betAmount);

    watch(
      () => props.betAmount,
      (newValue) => {
        betAmountLocal.value = newValue;
      }
    );

    const rollDice = () => {
      emit('roll-dice', betAmountLocal.value);
    };

    return {
      betAmountLocal,
      rollDice,
    };
  },
});
</script>