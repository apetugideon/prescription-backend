'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ailment = sequelize.define('Ailment', {
    names: DataTypes.STRING,
    description: DataTypes.STRING,
    symptons: DataTypes.STRING,
    relatedPictures: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER
  }, {});
  Ailment.associate = function(models) {
    Ailment.belongsTo(models.User, {foreignKey:'createdBy'});
    Ailment.belongsTo(models.User, {foreignKey:'modifiedBy'});
    Ailment.hasMany(models.Placement, {foreignKey: 'ailmentId'});
    Ailment.hasMany(models.Prescription, {foreignKey: 'ailmentId'});
    Ailment.hasMany(models.Verification, {foreignKey: 'ailmentId'});
    Ailment.hasMany(models.Formula);
  };
  return Ailment;
};