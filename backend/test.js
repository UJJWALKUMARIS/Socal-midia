import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

console.log('Testing Brevo API...');
console.log('API Key exists:', !!process.env.BREVO_API_KEY);
console.log('API Key length:', process.env.BREVO_API_KEY?.length);
console.log('API Key starts with:', process.env.BREVO_API_KEY?.substring(0, 15));

apiInstance.sendTransacEmail({
  sender: { email: "test@vybe.com", name: "Test" },
  to: [{ email: "uk7320942276@gmail.com" }],
  subject: "Test from Brevo",
  htmlContent: "<h1>This is a test email</h1><p>If you receive this, Brevo is working!</p>"
})
.then((result) => {
  console.log('✅ SUCCESS! Email sent:', result);
  console.log('Check your inbox!');
})
.catch((error) => {
  console.error('❌ ERROR:', error.message);
  console.error('Full error:', error);
});