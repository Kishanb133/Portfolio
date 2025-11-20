const { Client } = require('@notionhq/client');
const nodemailer = require('nodemailer');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Create email transporter (using Gmail)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

// Send email notification
const sendEmailNotification = async (formData, notionPageUrl) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER,
    subject: `🎯 New Portfolio Contact: ${formData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e6d3b, #2e8b57); color: white; padding: 20px; border-radius: 10px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1e6d3b; }
          .button { display: inline-block; background: #1e6d3b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📨 New Contact Form Submission</h2>
            <p>You have a new message from your portfolio website</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${formData.name}
            </div>
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${formData.email}">${formData.email}</a>
            </div>
            <div class="field">
              <span class="label">Service:</span> ${formData.service}
            </div>
            <div class="field">
              <span class="label">Message:</span><br>
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
            <div class="field">
              <span class="label">Submitted:</span> ${new Date().toLocaleString()}
            </div>
            <a href="${notionPageUrl}" class="button">📝 View in Notion</a>
            <a href="mailto:${formData.email}?subject=Re: Your portfolio inquiry&body=Hi ${formData.name.split(' ')[0]}," class="button" style="background: #004e92; margin-left: 10px;">✉️ Reply Directly</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.handler = async function(event, context) {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, service, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !service || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }

    // Submit to Notion
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        'Email': {
          email: email
        },
        'Service': {
          select: {
            name: service
          }
        },
        'Message': {
          rich_text: [
            {
              text: {
                content: message
              }
            }
          ]
        },
        'Status': {
          select: {
            name: 'New'
          }
        }
      }
    });

    // Construct Notion page URL
    const notionPageUrl = `https://notion.so/${response.id.replace(/-/g, '')}`;

    // Send email notification
    try {
      await sendEmailNotification({ name, email, service, message }, notionPageUrl);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        notionUrl: notionPageUrl 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};