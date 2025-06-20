// 调试版服务器 - 找出启动问题
console.log('🚀 开始启动调试服务器...');

try {
  console.log('📦 第1步: 导入基础模块...');
  const express = require('express');
  const cors = require('cors');
  console.log('✅ 基础模块导入成功');

  console.log('📦 第2步: 导入数据库模块...');
  const { initializeDatabase } = require('./models');
  console.log('✅ 数据库模块导入成功');

  console.log('📦 第3步: 导入路由模块...');
  const todoRoutes = require('./routes/todos');
  console.log('✅ 路由模块导入成功');

  console.log('🔧 第4步: 创建Express应用...');
  const app = express();
  const PORT = 5001;
  console.log('✅ Express应用创建成功');

  console.log('⚙️ 第5步: 配置中间件...');
  app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }));
  app.use(express.json());
  console.log('✅ 中间件配置成功');

  console.log('🛣️ 第6步: 配置路由...');
  app.get('/', (req, res) => {
    res.json({ message: '调试服务器运行正常', status: 'ok' });
  });
  
  app.use('/api/todos', todoRoutes);
  console.log('✅ 路由配置成功');

  console.log('🔄 第7步: 启动服务器...');
  
  // 异步启动函数
  async function startServer() {
    try {
      console.log('💾 初始化数据库...');
      await initializeDatabase();
      console.log('✅ 数据库初始化成功');

      console.log('🌐 启动HTTP服务器...');
      app.listen(PORT, () => {
        console.log('');
        console.log('🎉 ===== 调试服务器启动成功 =====');
        console.log(`🚀 地址: http://localhost:${PORT}`);
        console.log('=====================================');
      });
    } catch (error) {
      console.error('❌ 服务器启动失败:', error);
      throw error;
    }
  }

  startServer().catch(error => {
    console.error('💥 启动过程中出错:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('💥 模块导入阶段出错:', error);
  process.exit(1);
} 