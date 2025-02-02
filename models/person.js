'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Person.init({
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    face_landmarks_1: DataTypes.STRING,
    face_landmarks_2: DataTypes.STRING,
    face_landmarks_3: DataTypes.STRING,
    sample_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Person',
  });
  return Person;
};