'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define('Prescription', {
    names: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER
  }, {});
  Prescription.associate = function(models) {
    Prescription.hasMany(models.Formula, {foreignKey: 'prescriptionId'});
    Prescription.hasMany(models.Verification, {foreignKey: 'prescriptionId'});
    Prescription.belongsTo(models.User, {foreignKey:'createdBy'});
    Prescription.belongsTo(models.User, {foreignKey:'modifiedBy'});
  };
  return Prescription;
};
