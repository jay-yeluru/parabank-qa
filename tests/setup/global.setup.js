const { test, request } = require('@playwright/test');

test('Global Database Setup/Cleanup', async ({ }) => {
  const envConfig = require('../../configs/environment').config;
  
  const apiContext = await request.newContext({
    baseURL: envConfig.baseUrl
  });

  console.log(`Global Setup: Cleaning database at ${envConfig.baseUrl}`);
  
  // ParaBank REST API provides a cleanDB endpoint
  // This runs exactly ONCE before all project workers start
  const response = await apiContext.post('/parabank/services/bank/cleanDB');
  
  if (!response.ok()) {
      console.error(`Warning: Clean DB failed with status ${response.status()}`);
  }

  await apiContext.dispose();
});
