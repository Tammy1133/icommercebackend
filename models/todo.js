module.exports = (sequelize, dataTypes) => {
  const Todo = sequelize.define("todo", {
    item: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  return Todo;
};
