// Todo API 路由
// 提供任务的增删改查功能

const express = require('express');
const router = express.Router();
const { Todo } = require('../models');

// 📋 获取所有任务 (READ)
router.get('/', async (req, res) => {
  try {
    console.log('📋 请求获取所有任务');
    
    const todos = await Todo.findAll({
      order: [['createdAt', 'DESC']] // 按创建时间倒序排列，最新的在前面
    });
    
    console.log(`✅ 成功获取 ${todos.length} 个任务`);
    res.json({
      success: true,
      data: todos,
      message: '任务获取成功'
    });
  } catch (error) {
    console.error('❌ 获取任务失败:', error);
    res.status(500).json({ 
      success: false,
      error: '获取任务失败',
      details: error.message 
    });
  }
});

// ✏️ 创建新任务 (CREATE)
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    
    console.log('✏️ 请求创建新任务:', title);
    
    // 数据验证
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: '任务标题不能为空' 
      });
    }

    const todo = await Todo.create({
      title: title.trim()
    });
    
    console.log(`✅ 成功创建任务 ID: ${todo.id}`);
    res.status(201).json({
      success: true,
      data: todo,
      message: '任务创建成功'
    });
  } catch (error) {
    console.error('❌ 创建任务失败:', error);
    
    // 处理验证错误
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: '创建任务失败',
      details: error.message 
    });
  }
});

// 🔄 更新任务 (UPDATE)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;

    console.log(`🔄 请求更新任务 ID: ${id}`);

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        error: '任务不存在' 
      });
    }

    // 构建更新数据
    const updateData = {};
    if (completed !== undefined) updateData.completed = completed;
    if (title !== undefined && title.trim() !== '') {
      updateData.title = title.trim();
    }

    await todo.update(updateData);
    
    console.log(`✅ 成功更新任务 ID: ${id}`);
    res.json({
      success: true,
      data: todo,
      message: '任务更新成功'
    });
  } catch (error) {
    console.error('❌ 更新任务失败:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: '更新任务失败',
      details: error.message 
    });
  }
});

// 🗑️ 删除任务 (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ 请求删除任务 ID: ${id}`);

    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        error: '任务不存在' 
      });
    }

    await todo.destroy();
    
    console.log(`✅ 成功删除任务 ID: ${id}`);
    res.json({ 
      success: true,
      message: '任务删除成功' 
    });
  } catch (error) {
    console.error('❌ 删除任务失败:', error);
    res.status(500).json({ 
      success: false,
      error: '删除任务失败',
      details: error.message 
    });
  }
});

// 📊 获取任务统计信息
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 请求获取任务统计');
    
    const total = await Todo.count();
    const completed = await Todo.count({ where: { completed: true } });
    const pending = total - completed;
    
    const stats = {
      total,
      completed,
      pending,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
    
    console.log('✅ 成功获取任务统计:', stats);
    res.json({
      success: true,
      data: stats,
      message: '统计数据获取成功'
    });
  } catch (error) {
    console.error('❌ 获取统计失败:', error);
    res.status(500).json({ 
      success: false,
      error: '获取统计失败',
      details: error.message 
    });
  }
});

module.exports = router; 