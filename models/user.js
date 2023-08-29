module.exports = (sequelize, dataTypes) => {
  const user = sequelize.define("user", {
    username: {
      type: dataTypes.STRING,
    },
    password: {
      type: dataTypes.STRING,
    },
    token: {
      type: dataTypes.STRING,
    },
    question: {
      type: dataTypes.STRING,
    },
    answer: {
      type: dataTypes.STRING,
    },
    isAdmin: {
      type: dataTypes.BOOLEAN,
    },
    orders: {
      type: dataTypes.JSON,
    },
  });
  return user;
};
