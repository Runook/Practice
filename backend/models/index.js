// 数据库连接和模型初始化
// 负责连接数据库并初始化所有数据模型

const { Sequelize } = require('sequelize');
const config = require('../config/database');

// 获取当前环境（开发/生产）
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log(`🔌 正在连接数据库... (环境: ${env})`);

// 创建数据库连接
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// 导入Todo模型
const Todo = require('./Todo')(sequelize);

// 定义模型关系（如果有多个模型的话）
// Todo.belongsTo(User);

// 初始化数据库的函数
const initializeDatabase = async () => {
  await sequelize.authenticate();
  console.log('✅ 数据库连接成功');
  
  await sequelize.sync();
  console.log('✅ 数据库表创建成功');
};

// 导出数据库实例和模型
module.exports = {
  sequelize,
  Todo,
  initializeDatabase
}; 