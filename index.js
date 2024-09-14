const express = require('express');
const cors = require('cors');
const sequelize = require('./models').sequelize;
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5008;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
