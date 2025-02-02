'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Head extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Head.init({
    url: DataTypes.STRING,
    face_landmarks: DataTypes.TEXT,
    master_url: DataTypes.STRING,
    face_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Head',
  });
  return Head;
};