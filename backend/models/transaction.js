const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./transactions.db",
});

const TransactionType = {
  INIT: "init",
  BET: "bet",
  WIN: "win",
};

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: [TransactionType.INIT, TransactionType.BET, TransactionType.WIN],
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: false,
  }
);

sequelize.sync();

module.exports = { Transaction, sequelize, TransactionType };
