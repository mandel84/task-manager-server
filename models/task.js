module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project, { foreignKey: 'projectId' });
  };

  return Task;
};
