// File: netlify/functions/send-email.js

const emailjs = require('@emailjs/nodejs');

// These keys are stored securely in your Netlify site settings
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
// Note: The private key is needed for the Node.js SDK for extra security
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; 

exports.handler = async function (event, context) {
  // We only care about POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // The frontend sends the form data as a JSON string
  const data = JSON.parse(event.body);

  // Here we prepare the variables for our EmailJS template
  const templateParams = {
    to_name: data.to_name,
    to_email: data.to_email,
    from_name: 'Ihr Küchenstudio',
    order_summary: data.order_summary,
    order_total: data.order_total,
    customer_address: data.customer_address,
    customer_phone: data.customer_phone,
    customer_notes: data.customer_notes
  };
  
  try {
    // We send the email using the secure Node.js SDK
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY,
    });

    // Return a success message to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Bestellbestätigung wurde erfolgreich versendet!" }),
    };
  } catch (error) {
    console.error('EmailJS error:', error);
    // Return an error message to the frontend
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "E-Mail konnte nicht gesendet werden." }),
    };
  }
};