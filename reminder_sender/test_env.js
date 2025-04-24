const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("✅ API Key Loaded:", process.env.SENDGRID_API_KEY);
