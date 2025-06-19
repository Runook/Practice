// Todo 全栈应用后端服务器
// 包含Express服务器、数据库连接和API路由

const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const sequelize = new Sequelize('todoapp', 'ew-josh', null, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

// Todo模型定义
const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'todos',
  timestamps: true
});

// 路由

// 根路径
app.get('/', (req, res) => {
  res.json({ message: '✅ Todo API 服务器运行正常' });
});

// 获取所有任务
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建新任务
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: '标题不能为空' });
    }
    
    const todo = await Todo.create({ title });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新任务
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ success: false, error: '任务不存在' });
    }
    
    await todo.update({ title, completed });
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除任务
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ success: false, error: '任务不存在' });
    }
    
    await todo.destroy();
    res.json({ success: true, message: '任务删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 创建表格
    await sequelize.sync();
    console.log('✅ 数据库表创建成功');
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🎉 服务器启动成功！`);
      console.log(`🌐 访问地址: http://localhost:${PORT}`);
      console.log(`📋 API地址: http://localhost:${PORT}/api/todos`);
    });
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
  }
};

startServer(); 