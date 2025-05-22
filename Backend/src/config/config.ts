export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '1h',
  refreshTokenExpiresIn: '7d',
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development'
}; 