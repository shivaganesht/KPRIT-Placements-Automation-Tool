// AI Integration service for generating email templates and call scripts
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  // Generate cold email template
  async generateColdEmail(contactData, companyInfo = {}) {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `Generate a professional cold email for a student ambassador from KPRIT College to reach out to an HR professional for campus recruitment opportunities.

Contact Details:
- Name: ${contactData.name || 'HR Professional'}
- Position: ${contactData.position || 'HR Manager'}
- Company: ${contactData.company || 'Company'}
- Email: ${contactData.email || ''}

Requirements:
1. Professional and respectful tone
2. Mention KPRIT College's strengths
3. Include placement statistics
4. Request for partnership/recruitment opportunity
5. Keep it concise (under 300 words)
6. Include placeholders for ambassador details like [AMBASSADOR_NAME], [AMBASSADOR_EMAIL], [AMBASSADOR_PHONE]

Generate the email with a compelling subject line.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Parse the response to extract subject and body
      const lines = generatedText.split('\n');
      let subject = 'Partnership Opportunity - KPRIT College Placements';
      let body = generatedText;

      // Try to extract subject if it's marked
      const subjectMatch = generatedText.match(/Subject:\s*(.+)/i);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
        body = generatedText.replace(/Subject:\s*.+\n?/i, '').trim();
      }

      return {
        subject,
        body,
        variables: [
          'AMBASSADOR_NAME',
          'AMBASSADOR_EMAIL', 
          'AMBASSADOR_PHONE',
          'COLLEGE_WEBSITE'
        ]
      };
    } catch (error) {
      console.error('Error generating cold email:', error);
      // Fallback to template
      const template = {
        subject: `Partnership Opportunity - KPRIT College Placements`,
        body: `Dear ${contactData.name || 'HR Professional'},

I hope this email finds you well. My name is [AMBASSADOR_NAME], and I am a student ambassador at KPRIT College, representing our Training & Placement Cell.

I came across your profile as ${contactData.position || 'HR Professional'} at ${contactData.company || 'your company'}, and I believe there could be a valuable partnership opportunity between ${contactData.company || 'your company'} and our institution.

KPRIT College is home to bright, motivated students in various engineering and technology disciplines. Our graduates have consistently demonstrated excellence in:
• Technical skills and innovation
• Problem-solving abilities
• Strong work ethic and dedication
• Adaptability to industry requirements

We would love to explore how ${contactData.company || 'your company'} could benefit from recruiting our talented students. Our placement cell can facilitate:
• Campus recruitment drives
• Internship programs
• Project collaborations
• Industry-academia partnerships

Would you be available for a brief 15-minute call to discuss potential collaboration opportunities? I'm flexible with timing and would be happy to work around your schedule.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[AMBASSADOR_NAME]
KPRIT College - Student Ambassador
Training & Placement Cell
Email: [AMBASSADOR_EMAIL]
Phone: [AMBASSADOR_PHONE]

P.S. You can learn more about our college and placement achievements at [COLLEGE_WEBSITE]`,
        variables: [
          'AMBASSADOR_NAME',
          'AMBASSADOR_EMAIL', 
          'AMBASSADOR_PHONE',
          'COLLEGE_WEBSITE'
        ]
      };

      return template;
    }
  }

  // Generate follow-up email template
  async generateFollowUpEmail(contactData, previousContext = '') {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `Generate a professional follow-up email for a student ambassador from KPRIT College who previously contacted an HR professional about campus recruitment.

Contact Details:
- Name: ${contactData.name || 'HR Professional'}
- Position: ${contactData.position || 'HR Manager'}
- Company: ${contactData.company || 'Company'}
- Previous Context: ${previousContext || 'Initial outreach for campus recruitment'}

Requirements:
1. Polite and professional follow-up tone
2. Reference the previous communication
3. Add value with specific placement statistics
4. Provide specific time slots for scheduling
5. Keep it concise and action-oriented
6. Include placeholders like [AMBASSADOR_NAME], [TIME_SLOT_1], etc.

Generate the email with an appropriate subject line.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Parse the response to extract subject and body
      let subject = 'Re: Partnership Opportunity - KPRIT College Placements';
      let body = generatedText;

      const subjectMatch = generatedText.match(/Subject:\s*(.+)/i);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
        body = generatedText.replace(/Subject:\s*.+\n?/i, '').trim();
      }

      return {
        subject,
        body,
        variables: [
          'AMBASSADOR_NAME',
          'AMBASSADOR_EMAIL',
          'AMBASSADOR_PHONE',
          'TIME_SLOT_1',
          'TIME_SLOT_2',
          'TIME_SLOT_3'
        ]
      };
    } catch (error) {
      console.error('Error generating follow-up email:', error);
      // Fallback template
      const template = {
        subject: `Re: Partnership Opportunity - KPRIT College Placements`,
        body: `Dear ${contactData.name || 'HR Professional'},

I hope you're doing well. I wanted to follow up on my previous email regarding a potential partnership between ${contactData.company || 'your company'} and KPRIT College.

I understand you must be quite busy, but I believe this opportunity could be mutually beneficial. To give you a better sense of what we can offer:

Recent Placement Highlights:
• 95% placement rate in 2024
• Average package: ₹6.5 LPA
• Top package: ₹45 LPA
• 200+ companies recruited from our campus

Our students are skilled in cutting-edge technologies and are ready to contribute from day one. ${contactData.company || 'Your company'}'s reputation for innovation makes it an ideal partner for our tech-savvy graduates.

I'd be grateful for just 10 minutes of your time to discuss how we can support ${contactData.company || 'your company'}'s talent acquisition goals.

Would any of these times work for a quick call?
• [TIME_SLOT_1]
• [TIME_SLOT_2]
• [TIME_SLOT_3]

Alternatively, I'm happy to accommodate any time that works better for you.

Thank you for considering this opportunity.

Warm regards,
[AMBASSADOR_NAME]
KPRIT College - Student Ambassador
[AMBASSADOR_EMAIL] | [AMBASSADOR_PHONE]`,
        variables: [
          'AMBASSADOR_NAME',
          'AMBASSADOR_EMAIL',
          'AMBASSADOR_PHONE',
          'TIME_SLOT_1',
          'TIME_SLOT_2',
          'TIME_SLOT_3'
        ]
      };

      return template;
    }
  }

  // Generate cold call script
  async generateCallScript(contactData, scenario = 'initial') {
    try {
      let script = '';

      switch (scenario) {
        case 'initial':
          script = `COLD CALL SCRIPT - Initial Contact

OPENING (15 seconds):
"Hi ${contactData.name}, this is [AMBASSADOR_NAME] from KPRIT College. I hope I'm not catching you at a bad time?

[Wait for response]

I'm calling because I noticed ${contactData.company} values innovation and talent, and I believe there's an exciting opportunity for us to discuss.

PURPOSE (30 seconds):
"I'm a student ambassador with our Training & Placement Cell, and we have some exceptional graduates who I think would be a great fit for ${contactData.company}. 

Our students have consistently impressed recruiters with their technical skills and work ethic. In fact, we had a 95% placement rate last year with companies like [MENTION SIMILAR COMPANIES].

QUESTION (Engagement):
"Are you currently looking to hire fresh graduates or interns for your team?"

[Listen actively to their response]

IF INTERESTED:
"That's great! I'd love to share more about our programs. Could we schedule a brief 15-minute call this week to discuss how KPRIT students could contribute to ${contactData.company}? 

I have some compelling placement statistics and student project portfolios I think you'd find interesting."

IF NOT INTERESTED:
"I completely understand. Would it be helpful if I sent you some information about our placement program for future reference? That way, when you do have openings, you'll know about the quality of talent available at KPRIT."

CLOSING:
"Thank you for your time, ${contactData.name}. I appreciate the opportunity to connect with you. Have a great day!"

KEY TALKING POINTS:
• 95% placement rate
• Students skilled in [RELEVANT TECHNOLOGIES]
• Strong industry partnerships
• Flexible recruitment options
• No cost for initial campus visits

OBJECTION HANDLING:
1. "We're not hiring now" → "I understand. May I send information for future reference?"
2. "We don't recruit from tier-2 colleges" → "I'd love to change that perception with our placement statistics..."
3. "Too busy to talk" → "I appreciate that. Could I send a quick email with highlights?"`;
          break;

        case 'follow_up':
          script = `FOLLOW-UP CALL SCRIPT

OPENING:
"Hi ${contactData.name}, this is [AMBASSADOR_NAME] from KPRIT College. We spoke [TIME_PERIOD] ago about potential recruitment opportunities. Do you have a moment to chat?"

REFERENCE PREVIOUS CONVERSATION:
"You mentioned [PREVIOUS_POINT_DISCUSSED]. I wanted to follow up and share some updates that might interest you."

NEW VALUE PROPOSITION:
"Since our last conversation, we've had some exciting developments:
• [NEW_ACHIEVEMENT/PLACEMENT]
• [STUDENT_PROJECT_SUCCESS]
• [INDUSTRY_RECOGNITION]

UPDATE ON REQUEST:
"You also asked about [SPECIFIC_REQUEST]. I'm happy to report that [SOLUTION/UPDATE]."

CALL TO ACTION:
"Would you be interested in scheduling a campus visit? Or perhaps a virtual presentation about our programs?"

CLOSING:
"I appreciate your continued interest in KPRIT students. What would be the best way to move forward?"`;
          break;

        default:
          script = this.generateCallScript(contactData, 'initial');
      }

      return {
        script: script,
        duration: '5-10 minutes',
        preparation: [
          'Research the company and recent news',
          'Prepare specific examples of student achievements',
          'Have placement statistics ready',
          'Know your available time slots for scheduling'
        ],
        variables: [
          'AMBASSADOR_NAME',
          'MENTION_SIMILAR_COMPANIES',
          'RELEVANT_TECHNOLOGIES',
          'TIME_PERIOD',
          'PREVIOUS_POINT_DISCUSSED',
          'NEW_ACHIEVEMENT/PLACEMENT',
          'STUDENT_PROJECT_SUCCESS',
          'INDUSTRY_RECOGNITION',
          'SPECIFIC_REQUEST',
          'SOLUTION/UPDATE'
        ]
      };
    } catch (error) {
      console.error('Error generating call script:', error);
      throw new Error('Failed to generate call script');
    }
  }

  // Generate LinkedIn connection message
  async generateLinkedInMessage(contactData) {
    try {
      const template = {
        message: `Hi ${contactData.name}, I'm [AMBASSADOR_NAME], a student ambassador at KPRIT College. I'd love to connect and explore potential collaboration opportunities between ${contactData.company} and our talented students. Our graduates have been making great contributions at top companies, and I believe ${contactData.company} could benefit from our talent pool. Would appreciate the opportunity to connect!`,
        variables: ['AMBASSADOR_NAME']
      };

      return template;
    } catch (error) {
      console.error('Error generating LinkedIn message:', error);
      throw new Error('Failed to generate LinkedIn message');
    }
  }

  // Personalize template with actual data
  personalizeTemplate(template, variables) {
    let personalizedContent = template;
    
    Object.keys(variables).forEach(key => {
      const placeholder = `[${key}]`;
      personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), variables[key]);
    });
    
    return personalizedContent;
  }

  // Save template for reuse
  async saveTemplate(templateData) {
    try {
      // This would save to database in actual implementation
      const template = {
        id: Date.now().toString(),
        type: templateData.type,
        title: templateData.title,
        content: templateData.content,
        variables: templateData.variables || [],
        created_at: new Date().toISOString()
      };
      
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      throw new Error('Failed to save template');
    }
  }

  // Get all saved templates
  async getTemplates(type = null) {
    try {
      // Placeholder - would fetch from database
      const templates = [
        {
          id: '1',
          type: 'email',
          title: 'Standard Cold Email',
          content: 'Dear [CONTACT_NAME]...',
          variables: ['CONTACT_NAME', 'COMPANY_NAME'],
          created_at: '2025-09-13T10:00:00Z'
        },
        {
          id: '2',
          type: 'call_script',
          title: 'Initial Cold Call',
          content: 'Hi [CONTACT_NAME], this is [AMBASSADOR_NAME]...',
          variables: ['CONTACT_NAME', 'AMBASSADOR_NAME'],
          created_at: '2025-09-13T10:00:00Z'
        }
      ];
      
      return type ? templates.filter(t => t.type === type) : templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }
}

module.exports = AIService;