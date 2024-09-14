const express = require('express');
const router = express.Router();
const { Project,Task } = require('../models'); // Assuming Project is your Sequelize model

// Get all projects
router.get('/', async (req, res) => {
    try {
      const projects = await Project.findAll({
        include: [Task], // Include tasks for each project
      });
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });


router.get('/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Fetch the project and its tasks
      const project = await Project.findByPk(projectId, {
        include: [Task], // Include tasks associated with the project
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.json(project);
    } catch (error) {
      console.error('Error fetching project details:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });



// Get a project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

//Create a task for a specific project
router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const { projectId } = req.params;

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create the new task under the specific project
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



// Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.status(204).json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
