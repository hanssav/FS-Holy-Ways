'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

        user.hasMany(models.Payment, {
            as: "payment",
            foreignKey: {
                name: "userId"
            }
        })

        user.belongsToMany(models.Fund, {
            as: "Fund",
            through: {
                model: "Payment",
                as: "payment"
            },
            foreignKey: "userId",
            // foreignKey: "userId"
        })
    }
  };
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return user;
};