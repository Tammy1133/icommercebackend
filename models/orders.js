module.exports = (sequelize, dataTypes) => {
  const orders = sequelize.define("orders", {
    user: {
      type: dataTypes.JSON,
    },
    product: {
      type: dataTypes.JSON,
    },
    total: {
      type: dataTypes.STRING,
    },
  });
  return orders;
};
