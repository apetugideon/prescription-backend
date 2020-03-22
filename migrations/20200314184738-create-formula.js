'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Formulas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prescriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Prescriptions',
          key: 'id'
        }
      },
      ailmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ailments',
          key: 'id'
        }
      },
      usageTime: {
        type: Sequelize.STRING(15)
      },
      dosage: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      modifiedBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Formulas');
  }
};