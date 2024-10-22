const OriginalCombinationCoef = {
  BALUT: 4,
  STRAIGHT: 5,
  FULL_HOUSE: 3,
  PAIR: 2,
  OTHER: 0,
};

function rollDice() {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

function determineResult(diceValues) {
  const counts = {};
  diceValues.forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });

  const uniqueValues = Object.keys(counts).length;
  const maxCount = Math.max(...Object.values(counts));

  if (uniqueValues === 1) {
    return OriginalCombinationCoef.BALUT;
  }
  if (uniqueValues === 5 && (!counts[1] || !counts[6])) {
    return OriginalCombinationCoef.STRAIGHT;
  }
  if (uniqueValues === 2 && (maxCount === 3 || maxCount === 2)) {
    return OriginalCombinationCoef.FULL_HOUSE;
  }
  if (maxCount >= 2) {
    return OriginalCombinationCoef.PAIR;
  }
  return OriginalCombinationCoef.OTHER;
}

function simulateBets(numBets) {
  let totalWins = 0;
  let totalBets = 0;

  for (let i = 0; i < numBets; i++) {
    const betAmount = 10;
    totalBets += betAmount;

    const diceValues = rollDice();
    const result = determineResult(diceValues);
    totalWins += result * betAmount;
  }

  const rtp = (totalWins / totalBets) * 100;
  return rtp;
}

function taskOne() {
  const simulations = [1000, 10000, 100000, 1000000];

  simulations.forEach((numSims) => {
    const rtp = simulateBets(numSims);
    console.log(`RTP after ${numSims} simulations: ${rtp.toFixed(2)}%`);
  });
}

function calculateProbabilities(numSimulations = 1000000) {
  let combinations = {
    BALUT: 0,
    STRAIGHT: 0,
    FULL_HOUSE: 0,
    PAIR: 0,
    OTHER: 0,
  };

  for (let i = 0; i < numSimulations; i++) {
    const diceValues = rollDice();
    const result = determineResult(diceValues);

    switch (result) {
      case OriginalCombinationCoef.BALUT:
        combinations.BALUT++;
        break;
      case OriginalCombinationCoef.STRAIGHT:
        combinations.STRAIGHT++;
        break;
      case OriginalCombinationCoef.FULL_HOUSE:
        combinations.FULL_HOUSE++;
        break;
      case OriginalCombinationCoef.PAIR:
        combinations.PAIR++;
        break;
      case OriginalCombinationCoef.OTHER:
        combinations.OTHER++;
        break;
    }
  }

  Object.keys(combinations).forEach((key) => {
    combinations[key] = combinations[key] / numSimulations;
  });

  return combinations;
}

function optimizeCoefficients(targetRTP = 95, tolerance = 0.1) {
  const currentRTP = simulateBets(1000000);
  const adjustmentFactor = targetRTP / currentRTP;

  const optimizedCoefs = {
    BALUT: OriginalCombinationCoef.BALUT * adjustmentFactor,
    STRAIGHT: OriginalCombinationCoef.STRAIGHT * adjustmentFactor,
    FULL_HOUSE: OriginalCombinationCoef.FULL_HOUSE * adjustmentFactor,
    PAIR: OriginalCombinationCoef.PAIR * adjustmentFactor,
    OTHER: OriginalCombinationCoef.OTHER,
  };

  Object.keys(optimizedCoefs).forEach((key) => {
    optimizedCoefs[key] = Math.round(optimizedCoefs[key] * 100) / 100;
  });

  return optimizedCoefs;
}

function testOptimizedCoefficients(coefficients) {
  const originalCombinationCoef = { ...OriginalCombinationCoef };
  Object.assign(OriginalCombinationCoef, coefficients);
  const simulations = 1000000;
  const newRTP = simulateBets(simulations);

  console.log("\nTesting optimized coefficients:");
  console.log("New coefficients:", coefficients);
  console.log(
    `Achieved RTP: ${newRTP.toFixed(2)}%  with ${simulations} simulations`
  );

  Object.assign(OriginalCombinationCoef, originalCombinationCoef);

  return newRTP;
}

const optimizedCoefficients = optimizeCoefficients(95);
taskOne();
testOptimizedCoefficients(optimizedCoefficients);
