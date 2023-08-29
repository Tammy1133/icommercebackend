module.exports = (sequelize, dataTypes) => {
  const Product = sequelize.define("product", {
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    category: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: {
      type: dataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return Product;
};
