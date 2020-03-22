'use strict';
module.exports = (sequelize, DataTypes) => {
  const Formula = sequelize.define('Formula', {
    prescriptionId: DataTypes.INTEGER,
    ailmentId: DataTypes.INTEGER,
    usageTime: DataTypes.STRING,
    dosage: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER
  }, {});
  Formula.associate = function(models) {
    Formula.belongsTo(models.Prescription, {foreignKey:'prescriptionId'});
    Formula.belongsTo(models.Ailment, {foreignKey:'ailmentId'});
    Formula.hasMany(models.Verification, {foreignKey: 'formulaId'});
    Formula.belongsTo(models.User, {foreignKey:'createdBy'});
    Formula.belongsTo(models.User, {foreignKey:'modifiedBy'});
  };
  return Formula;
};