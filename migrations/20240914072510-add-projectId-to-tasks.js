'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'projectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects', 
        key: 'id',         
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'projectId');
  }
};
