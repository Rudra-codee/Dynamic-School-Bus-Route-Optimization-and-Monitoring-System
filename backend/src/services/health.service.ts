export const checkSystemHealth = () => {
  return {
    status: 'success',
    service: 'Dynamic School Bus API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
};
