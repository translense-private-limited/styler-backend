const axios = require('axios');
console.log('Data seeding started...');

async function getSeededData() {
  try {
    await axios.post('http://localhost:4000/seed');
    return {
      message: 'Data seeding completed successfully',
    };
  } catch (error) {
    console.error('Error during data seeding:', error.message);
    return { message: 'Data seeding failed' };
  }
}

// Example usage
getSeededData().then((response) => console.log(response));
