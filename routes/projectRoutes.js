const express = require('express');
const router = express.Router();
const { Project,Task } = require('../models'); 


router.get('/', async (req, res) => {
    try {
      const projects = await Project.findAll({
        include: [Task], 
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
  
      const project = await Project.findByPk(projectId, {
        include: [Task], 
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

router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

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
