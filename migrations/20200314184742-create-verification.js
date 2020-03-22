'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Verifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      placementId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Placements',
          key: 'id'
        }
      },
      formulaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Formulas',
          key: 'id'
        }
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
      status: {
        type: Sequelize.CHAR(1)
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
      useDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => queryInterface.addConstraint('Verifications', ['placementId','formulaId','prescriptionId','ailmentId','useDate'], {
      type: 'unique',
      name: 'custom_unique_constraint_name'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Verifications');
  }
};