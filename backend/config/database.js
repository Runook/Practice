// 数据库配置
// 包含开发环境和生产环境的数据库连接配置

module.exports = {
  // 开发环境配置
  development: {
    host: 'localhost',        // 数据库主机
    port: 5432,              // PostgreSQL默认端口
    database: 'todoapp',     // 数据库名称
    username: 'ew-josh',     // 你的用户名
    password: null,          // 本地开发无需密码
    dialect: 'postgres',     // 数据库类型
    logging: false           // 在控制台不显示SQL语句（开发时有用）
  },
  
  // 生产环境配置
  production: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'todoapp',
    username: process.env.DB_USER || 'ew-josh',
    password: process.env.DB_PASSWORD || null,
    dialect: 'postgres',
    logging: false           // 生产环境不显示SQL语句
  }
}; 