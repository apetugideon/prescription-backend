'use strict';
module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define('Verification', {
    placementId: DataTypes.INTEGER,
    formulaId: DataTypes.INTEGER,
    prescriptionId: DataTypes.INTEGER,
    ailmentId: DataTypes.INTEGER,
    status: DataTypes.CHAR,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER,
    useDate: DataTypes.DATEONLY
  }, {});
  Verification.associate = function(models) {
    Verification.belongsTo(models.Placement, {foreignKey:'placementId'});
    Verification.belongsTo(models.Formula, {foreignKey:'formulaId'});
    Verification.belongsTo(models.Prescription, {foreignKey:'prescriptionId'});
    Verification.belongsTo(models.Ailment, {foreignKey:'ailmentId'});
    Verification.belongsTo(models.User, {foreignKey:'createdBy'});
    Verification.belongsTo(models.User, {foreignKey:'modifiedBy'});
  };
  return Verification;
};