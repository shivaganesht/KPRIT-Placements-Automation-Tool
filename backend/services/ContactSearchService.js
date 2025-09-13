const axios = require('axios');

class ContactSearchService {
  constructor() {
    this.apolloApiKey = process.env.APOLLO_API_KEY;
    this.apolloBaseUrl = 'https://api.apollo.io/v1';
  }

  // Main search function that only uses Apollo API
  async searchContacts(company, filters = {}) {
    try {
      console.log(`🔍 Searching contacts for company: ${company}`);
      
      // Only use Apollo API - no mock data
      const apolloResults = await this.searchApollo(company, filters);
      console.log(`📊 Apollo results: ${apolloResults.length}`);
      
      // Return real results only
      return apolloResults.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Contact search error:', error);
      return []; // Return empty array if Apollo fails - no mock data
    }
  }

  // Apollo API integration - real data only
  async searchApollo(company, filters = {}) {
    try {
      if (!this.apolloApiKey) {
        console.log('❌ Apollo API key not configured');
        return [];
      }

      console.log(`🚀 Using Apollo API with key: ${this.apolloApiKey.substring(0, 4)}...`);

      const searchParams = {
        q_organization_name: company,
        page: 1,
        per_page: 25,
        person_titles: ['HR', 'Human Resources', 'Talent Acquisition', 'Recruitment', 'People Operations', 'HRBP']
      };

      // Add location filter if provided
      if (filters.location) {
        searchParams.person_locations = [filters.location];
      }

      console.log('📡 Making Apollo API request with params:', searchParams);

      const response = await axios.get(`${this.apolloBaseUrl}/mixed_people/search`, {
        params: searchParams,
        timeout: 15000,
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'X-Api-Key': this.apolloApiKey
        }
      });

      console.log('✅ Apollo API response received:', {
        status: response.status,
        dataKeys: Object.keys(response.data || {}),
        peopleCount: response.data?.people?.length || 0
      });

      if (response.data && response.data.people && response.data.people.length > 0) {
        const mappedResults = response.data.people.map(person => ({
          id: person.id || Math.random().toString(36).substr(2, 9),
          name: person.name || 'N/A',
          position: person.title || 'HR Professional',
          company: person.organization?.name || company,
          email: person.email || null, // Keep null if no real email
          linkedin: person.linkedin_url || null, // Keep null if no real LinkedIn
          location: person.city || person.state || person.country || 'Not specified',
          experience: `${person.years_in_current_role || 'N/A'} years in current role`,
          verified: !!person.email,
          source: 'Apollo API',
          phone: person.phone || null,
          department: person.departments?.[0] || 'Human Resources'
        }));
        
        console.log(`🎯 Successfully mapped ${mappedResults.length} Apollo results`);
        return mappedResults;
      } else {
        console.log('⚠️ Apollo API returned no people data');
        console.log('  Response data structure:', JSON.stringify(response.data, null, 2));
        return [];
      }

    } catch (error) {
      console.error('❌ Apollo API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      return []; // Return empty array on error - no mock data
    }
  }

  // Advanced search with additional filters
  async advancedSearch(searchParams) {
    const {
      company,
      location,
      experience_level,
      department,
      seniority_level
    } = searchParams;

    const filters = {
      location,
      experience_level,
      department,
      seniority_level
    };

    return await this.searchContacts(company, filters);
  }

  // Get contact details by ID (for detailed view)
  async getContactDetails(contactId, source = 'apollo') {
    try {
      if (source === 'apollo' && this.apolloApiKey) {
        const response = await axios.get(`${this.apolloBaseUrl}/people/${contactId}`, {
          headers: {
            'X-Api-Key': this.apolloApiKey
          }
        });
        
        if (response.data && response.data.person) {
          const person = response.data.person;
          return {
            ...person,
            social_links: person.social_urls || [],
            work_history: person.employment_history || [],
            education: person.education || []
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Get contact details error:', error);
      return null;
    }
  }

  // Enrich contact data with additional information
  async enrichContact(email) {
    try {
      if (!this.apolloApiKey) {
        return null;
      }

      const response = await axios.get(`${this.apolloBaseUrl}/people/match`, {
        params: {
          email
        },
        headers: {
          'X-Api-Key': this.apolloApiKey
        }
      });

      return response.data?.person || null;
    } catch (error) {
      console.error('Contact enrichment error:', error);
      return null;
    }
  }
}

module.exports = ContactSearchService;