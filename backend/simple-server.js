const express = require('express');
const cors = require('cors');

console.log('开始创建服务器...');

const app = express();
const PORT = 3001;

console.log('Express应用创建完成');

// 中间件设置
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// 主页路由
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ 简化版 Todo API 服务器运行正常！',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

console.log('路由设置完成');

const server = app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

console.log('服务器启动命令已执行'); 