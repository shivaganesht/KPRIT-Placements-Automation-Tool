# Google Sheets Integration Documentation

## Overview
The T&P Cell Ambassador Tool integrates with Google Sheets to provide real-time synchronization of approved contacts, enabling seamless collaboration between the digital platform and traditional spreadsheet workflows.

## Features
- **Real-time Sync**: Automatic synchronization between the web application and Google Sheets
- **Approved Contacts Export**: All approved contacts are automatically added to the designated Google Sheet
- **Bulk Export**: Export all data in CSV format for external use
- **Statistics Dashboard**: Real-time statistics pulled from Google Sheets data
- **Data Validation**: Ensures data consistency between platform and sheets

## Setup Instructions

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Sheets API
4. Create credentials (API Key or Service Account)

### 2. Google Sheets Preparation
1. Create a new Google Spreadsheet
2. Set up the following columns in the first row:
   - Company Name
   - Contact Person
   - Designation
   - Email
   - Phone
   - Industry
   - Submitted By
   - Submitted Date
   - Approval Status
   - Approved By
   - Approved Date
   - Credits

3. Share the spreadsheet with the service account email (if using service account)
4. Copy the Spreadsheet ID from the URL

### 3. Environment Configuration
Add the following environment variables to your `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_SHEET_NAME=ApprovedContacts

# Alternative: Service Account Configuration
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key_here
```

### 4. Spreadsheet ID Location
The Spreadsheet ID can be found in the Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit#gid=0
```

## API Usage

### Basic Implementation

```typescript
import { googleSheetsService } from '@/lib/googleSheets';

// Initialize the service
await googleSheetsService.initialize();

// Add an approved contact
const newContact = {
  companyName: 'TechCorp India',
  contactPerson: 'John Doe',
  designation: 'HR Manager',
  email: 'john@techcorp.in',
  phone: '+91-9876543210',
  industry: 'Information Technology',
  submittedBy: 'student@kprit.edu.in',
  submittedDate: '2024-01-15',
  approvalStatus: 'Approved',
  approvedBy: 'admin@kprit.edu.in',
  approvedDate: '2024-01-16',
  credits: 30
};

const success = await googleSheetsService.addApprovedContact(newContact);
```

### Export Data

```typescript
// Export to CSV
const csvData = await googleSheetsService.exportToCSV();
downloadCSV(csvData, 'approved-contacts.csv');

// Get statistics
const stats = await googleSheetsService.getSheetStats();
console.log('Total contacts:', stats.totalContacts);
```

### Sync Operations

```typescript
// Sync with local database
const syncSuccess = await googleSheetsService.syncWithDatabase();

// Get all approved contacts
const contacts = await googleSheetsService.getApprovedContacts();
```

## Data Structure

### Contact Record Format
```typescript
interface SheetRow {
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  industry: string;
  submittedBy: string;
  submittedDate: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  credits?: number;
}
```

## Workflow Integration

### Contact Approval Process
1. Student submits contact through web application
2. Admin reviews and approves contact
3. **Automatically triggers Google Sheets update**
4. Contact data is added to the designated sheet
5. Credits are awarded to the student
6. Real-time statistics are updated

### Data Flow Diagram
```
Student Submission → Database → Admin Approval → Google Sheets → Statistics Update
                                      ↓
                              Credits Awarded → Leaderboard Update
```

## Error Handling

### Common Issues and Solutions

1. **Authentication Errors**
   - Verify API key or service account credentials
   - Check if Google Sheets API is enabled
   - Ensure spreadsheet is shared with service account

2. **Permission Errors**
   - Verify spreadsheet sharing permissions
   - Check if service account has edit access
   - Confirm spreadsheet exists and is accessible

3. **Data Format Errors**
   - Validate data before sending to sheets
   - Ensure all required fields are present
   - Check for special characters in data

### Error Handling Example
```typescript
try {
  const success = await googleSheetsService.addApprovedContact(contact);
  if (!success) {
    console.error('Failed to add contact to Google Sheets');
    // Handle error appropriately
  }
} catch (error) {
  console.error('Google Sheets integration error:', error);
  // Fallback to local storage or queue for retry
}
```

## Security Considerations

1. **API Key Protection**
   - Never expose API keys in client-side code
   - Use environment variables for sensitive data
   - Implement proper access controls

2. **Data Privacy**
   - Ensure GDPR compliance for contact data
   - Implement data retention policies
   - Provide data export/deletion options

3. **Access Control**
   - Limit spreadsheet access to authorized personnel
   - Use service accounts with minimal required permissions
   - Regular audit of access logs

## Performance Optimization

### Batch Operations
```typescript
// Instead of multiple individual calls
const contacts = [contact1, contact2, contact3];
for (const contact of contacts) {
  await addApprovedContact(contact); // Slow
}

// Use batch operations (when available)
await googleSheetsService.batchAddContacts(contacts); // Faster
```

### Caching Strategy
- Cache frequently accessed data locally
- Implement periodic sync instead of real-time for non-critical updates
- Use background jobs for heavy operations

## Monitoring and Analytics

### Key Metrics to Track
- Sync success rate
- API response times
- Data consistency between platform and sheets
- User engagement with exported data

### Logging
```typescript
// Implement comprehensive logging
console.log('Sheets sync started:', new Date());
console.log('Records processed:', recordCount);
console.log('Sync completed successfully');
```

## Troubleshooting Guide

### Checklist for Common Issues
- [ ] Google Sheets API is enabled
- [ ] Credentials are properly configured
- [ ] Spreadsheet exists and is accessible
- [ ] Sheet name matches configuration
- [ ] Data format matches expected structure
- [ ] Network connectivity is stable

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_GOOGLE_SHEETS=true
```

## Future Enhancements

1. **Real-time Collaboration**
   - WebSocket integration for live updates
   - Conflict resolution for simultaneous edits
   - Version history tracking

2. **Advanced Analytics**
   - Automated reports generation
   - Trend analysis
   - Predictive insights

3. **Integration Expansion**
   - Microsoft Excel Online support
   - Airtable integration
   - Custom webhook endpoints

## Support and Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Account Setup Guide](https://cloud.google.com/docs/authentication/getting-started)

For technical support, contact the development team or check the project's GitHub repository for the latest updates and issues.