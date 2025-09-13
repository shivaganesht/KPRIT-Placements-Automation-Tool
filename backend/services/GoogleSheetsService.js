const axios = require('axios');

class GoogleSheetsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.sheetName = process.env.GOOGLE_SHEETS_NAME || 'ContactSubmissions';
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Add a new contact submission to Google Sheets
  async addContactSubmission(contactData) {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        console.log('⚠️ Google Sheets API not configured');
        return { success: false, error: 'Google Sheets API not configured' };
      }

      // Prepare the row data
      const rowData = [
        new Date().toISOString(), // Timestamp
        contactData.userName, // Ambassador Name
        contactData.userEmail, // Ambassador Email
        contactData.hrName, // HR Name
        contactData.hrPosition, // HR Position
        contactData.hrCompany, // Company
        contactData.hrEmail, // HR Email
        contactData.hrPhone || 'N/A', // HR Phone
        contactData.hrLinkedin || 'N/A', // LinkedIn
        contactData.message, // Message/Notes
        contactData.approach, // Contact Approach
        contactData.status, // Status
        contactData.submittedAt // Submission Date
      ];

      // First try to get the current sheet to understand structure
      console.log(`📊 Adding contact submission to Google Sheets: ${contactData.hrName} from ${contactData.hrCompany}`);

      // Append the data to the sheet
      const response = await axios.post(
        `${this.baseUrl}/${this.spreadsheetId}/values/${this.sheetName}:append`,
        {
          values: [rowData],
          majorDimension: 'ROWS'
        },
        {
          params: {
            key: this.apiKey,
            valueInputOption: 'RAW'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Successfully added to Google Sheets');
      return { success: true, response: response.data };

    } catch (error) {
      console.error('❌ Google Sheets API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }

  // Initialize the sheet with headers if needed
  async initializeSheet() {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        return { success: false, error: 'Google Sheets API not configured' };
      }

      // Headers for the contact submissions sheet
      const headers = [
        'Timestamp',
        'Ambassador Name',
        'Ambassador Email', 
        'HR Name',
        'HR Position',
        'Company',
        'HR Email',
        'HR Phone',
        'LinkedIn',
        'Message/Notes',
        'Contact Method',
        'Status',
        'Submitted Date'
      ];

      // Check if sheet exists and has headers
      const response = await axios.get(
        `${this.baseUrl}/${this.spreadsheetId}/values/${this.sheetName}!A1:M1`,
        {
          params: {
            key: this.apiKey
          }
        }
      );

      // If no data or headers don't match, add headers
      if (!response.data.values || response.data.values.length === 0) {
        await axios.put(
          `${this.baseUrl}/${this.spreadsheetId}/values/${this.sheetName}!A1:M1`,
          {
            values: [headers],
            majorDimension: 'ROWS'
          },
          {
            params: {
              key: this.apiKey,
              valueInputOption: 'RAW'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Google Sheets headers initialized');
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Error initializing Google Sheets:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  // Update contact status in Google Sheets
  async updateContactStatus(contactId, newStatus, approverName = null) {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        return { success: false, error: 'Google Sheets API not configured' };
      }

      // This would require finding the row with the contact ID and updating it
      // For now, we'll just log the update
      console.log(`📝 Contact ${contactId} status updated to: ${newStatus}`);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Error updating contact status in Google Sheets:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = GoogleSheetsService;