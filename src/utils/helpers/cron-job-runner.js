const axios = require('axios');
console.log('Data seeding started...');

async function executeCronJob() {
  try {
    await axios.get('http://localhost:4000/cronjob');
    return {
      message: 'Cron Job Executed successfully',
    };
  } catch (error) {
    console.error('Error in cron job  execution:', error.message);
    return { message: 'Cron Job Failed' };
  }
}

// Example usage
executeCronJob().then((response) => console.log(response));
