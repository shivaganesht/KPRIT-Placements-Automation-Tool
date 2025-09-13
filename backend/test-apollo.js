const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function testApolloAPI() {
  console.log('Testing Apollo API directly...');
  console.log('API Key:', process.env.APOLLO_API_KEY ? `${process.env.APOLLO_API_KEY.substring(0, 4)}...` : 'NOT FOUND');
  
  const apolloApiKey = process.env.APOLLO_API_KEY;
  const apolloBaseUrl = 'https://api.apollo.io/v1';
  
  if (!apolloApiKey) {
    console.log('❌ No Apollo API key found');
    return;
  }

  const searchParams = {
    q_organization_name: 'Microsoft',
    page: 1,
    per_page: 5,
    person_titles: ['HR', 'Human Resources', 'Talent Acquisition']
  };

  try {
    console.log('📡 Making request to Apollo API...');
    console.log('URL:', `${apolloBaseUrl}/mixed_people/search`);
    console.log('Params:', JSON.stringify(searchParams, null, 2));

    const response = await axios.get(`${apolloBaseUrl}/mixed_people/search`, {
      params: searchParams,
      timeout: 15000,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Api-Key': apolloApiKey
      }
    });

    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data keys:', Object.keys(response.data || {}));
    console.log('Full response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Apollo API Error:');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
  }
}

testApolloAPI();