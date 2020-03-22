'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    names: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNum: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    userRole:DataTypes.CHAR,
    createdBy: DataTypes.INTEGER,
    modifiedBy: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Ailment, {foreignKey:'createdBy'});
    User.hasMany(models.Ailment, {foreignKey:'modifiedBy'});

    User.hasMany(models.Placement, {primaryKey:'userId'});
    
    User.hasMany(models.Placement, {foreignKey:'createdBy'});
    User.hasMany(models.Placement, {foreignKey:'modifiedBy'});

    User.hasMany(models.Formula, {foreignKey:'createdBy'});
    User.hasMany(models.Formula, {foreignKey:'modifiedBy'});

    User.hasMany(models.Prescription, {foreignKey:'createdBy'});
    User.hasMany(models.Prescription, {foreignKey:'modifiedBy'});

    User.hasMany(models.Verification, {foreignKey:'createdBy'});
    User.hasMany(models.Verification, {foreignKey:'modifiedBy'});

    
  };
  return User;
};