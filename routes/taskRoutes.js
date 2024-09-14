const express = require('express');
const router = express.Router();
const { Project,Task } = require('../models');




router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/projects/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const tasks = await Task.findAll({ where: { projectId } });
  
      if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this project' });
      }
  
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks for project:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  



router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId } = req.body;

    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

   
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      projectId: projectId || null,  
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.put('/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(req.body.priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
      }
  
      await task.update(req.body);
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  



router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
