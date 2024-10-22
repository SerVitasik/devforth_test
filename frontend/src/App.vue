<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import DiceComponent from './components/Dice.vue';
import BetComponent from './components/Bet.vue';
import ResultComponent from './components/Result.vue';
import Container from './components/Container.vue';
import axios from 'axios';

export default defineComponent({
  components: {
    DiceComponent,
    BetComponent,
    ResultComponent,
    Container,
  },
  setup() {
    const diceValues = ref<string[] | number[]>(['?', '?', '?', '?', '?']);
    const resultMessage = ref('');
    const balance = ref(100);
    const betAmount = ref(0);
    const isRolling = ref(false);

    const getBalance = async () => {
      try {
        const response = await axios.get('http://localhost:8000/balance');
        balance.value = response.data.balance;
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        alert('Error fetching balance. Please try again later.');
      }
    };

    const handleRollDice = async (bet: number) => {
      if (bet > balance.value) {
        alert('Not enough balance to place this bet.');
        return;
      }

      betAmount.value = bet;
      isRolling.value = true;

      try {
        await axios.post('http://localhost:8000/transactions', {
          amount: -betAmount.value,
          transaction_type: 'bet',
        });
        await getBalance();

        setTimeout(() => {
          rollDice();
          isRolling.value = false;
        }, 2000);
      } catch (error) {
        console.error('Failed to place bet:', error);
        alert('Failed to place your bet. Please try again.');
        isRolling.value = false;
      }
    };

    const rollDice = () => {
      diceValues.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      checkResult();
    };

    const checkResult = () => {
      const counts: Record<string | number, number> = diceValues.value.reduce((acc: Record<string | number, number>, val: string | number) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

      const uniqueValues = Object.keys(counts).length;
      const maxCount = Math.max(...Object.values(counts));
      let payoutMultiplier = 0;

      if (uniqueValues === 1) {
        resultMessage.value = 'Balut';
        payoutMultiplier = 4;
      } else if (uniqueValues === 5 && (!counts[1] || !counts[6])) {
        resultMessage.value = 'Straight';
        payoutMultiplier = 5;
      } else if (uniqueValues === 2 && (maxCount === 3 || maxCount === 2)) {
        resultMessage.value = 'Full house';
        payoutMultiplier = 3;
      } else if (maxCount >= 2) {
        resultMessage.value = 'Pair';
        payoutMultiplier = 2;
      } else {
        resultMessage.value = 'No special combination';
        payoutMultiplier = 0;
      }

      if (payoutMultiplier > 0) {
        handleWin(payoutMultiplier);
      }
    };

    const handleWin = async (payoutMultiplier: number) => {
      const winAmount = betAmount.value * payoutMultiplier;

      try {
        await axios.post('http://localhost:8000/transactions', {
          amount: winAmount,
          transaction_type: 'win',
        });
        await getBalance();
      } catch (error) {
        console.error('Failed to process win:', error);
        alert('Failed to process your winnings. Please try again.');
      }
    };

    onMounted(() => {
      getBalance();
    });

    return {
      diceValues,
      resultMessage,
      balance,
      betAmount,
      isRolling,
      handleRollDice,
    };
  },
});
</script>

<template>
  <Container>
    <DiceComponent  :isRolling="isRolling" :diceValues="diceValues" />

    <div class="grid grid-cols-2 gap-5">
      <ResultComponent
        :resultMessage="resultMessage"
      />

      <BetComponent
        :betAmount="betAmount"
        :balance="balance"
        :isRolling="isRolling"
        @roll-dice="handleRollDice"
      />
    </div>
  </Container>
</template>