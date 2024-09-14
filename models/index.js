'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env]; // Use config.js instead of config.json
const db = {};

// Initialize Sequelize with the DATABASE_URL or config file
let sequelize;
if (process.env.DATABASE_URL) {
  // If DATABASE_URL is defined, use it (this is typical for production and staging environments)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true, // Enforce SSL for Neon
        rejectUnauthorized: false, // Accept self-signed certs
      },
    },
  });
} else {
  // Otherwise, use the settings in config/config.js for development environments
  sequelize = new Sequelize(config.url, config);
}

// Load all models from the models folder
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
