'use strict';
module.exports = (sequelize, DataTypes) => {
  const Placement = sequelize.define('Placement', {
    names: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    ailmentId: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    status: DataTypes.CHAR,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER
  }, {});
  Placement.associate = function(models) {
    Placement.belongsTo(models.User, {foreignKey:'userId'});
    Placement.belongsTo(models.Ailment, {foreignKey:'ailmentId'});
    Placement.hasMany(models.Verification, {foreignKey: 'placementId'});
    //Placement.belongsTo(models.User, {foreignKey:'createdBy'});
    //Placement.belongsTo(models.User, {foreignKey:'modifiedBy'});
  };
  return Placement;
};