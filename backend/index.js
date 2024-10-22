const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  Transaction,
  sequelize,
  TransactionType,
} = require("./models/transaction");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 8000;

const addTransaction = async (amount, type) => {
  if (type === TransactionType.INIT) {
    throw new Error(
      "INIT transactions can only be created during initialization."
    );
  }
  return await Transaction.create({ value: amount, type });
};

const addInitTransaction = async (amount) => {
  return await Transaction.create({
    value: amount,
    type: TransactionType.INIT,
  });
};

app.post("/transactions", async (req, res) => {
  const { amount, transaction_type } = req.body;

  if (!amount || !transaction_type) {
    return res
      .status(400)
      .json({ error: "Amount and transaction type are required." });
  }

  try {
    if (transaction_type === TransactionType.BET) {
      const balance = await getBalance();
      if (amount > balance) {
        return res.status(400).json({ error: "Insufficient balance." });
      }
    }

    const newTransaction = await addTransaction(amount, transaction_type);
    return res.status(200).json(newTransaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/balance", async (req, res) => {
  try {
    const balance = await getBalance();
    return res.json({ balance });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const getBalance = async () => {
  const transactions = await Transaction.findAll();
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.value,
    0
  );
  return balance;
};

const initTransaction = async () => {
  const initialTransaction = await Transaction.findOne({
    where: { type: TransactionType.INIT },
  });
  if (!initialTransaction) {
    await addInitTransaction(100);
  }
};

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    await initTransaction();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
});
