const path = require("path");
const dotenvPath = path.resolve(__dirname, ".env");
console.log("⏳ Loading .env from:", dotenvPath);

// 🔧 Load .env variables FIRST
require("dotenv").config({ path: dotenvPath });

// Debug loaded env vars
console.log("Loaded API KEY:", process.env.SENDGRID_API_KEY);
console.log("Loaded SENDER:", process.env.SENDGRID_SENDER);

const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const { Timestamp } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Initialize Firebase BEFORE calling Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Set SendGrid API key using env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



async function sendReminders() {
  const now = new Date();

  const snapshot = await db.collection("ToDo")
    .where("reminderSent", "==", false)
    .where("reminderTime", "<=", Timestamp.fromDate(now))
    .get();

  if (snapshot.empty) {
    console.log("✅ No reminders to send.");
    return;
  }

  for (const doc of snapshot.docs) {
    const task = doc.data();
    const userEmail = task.userEmail;

    if (!userEmail) {
      console.warn("❌ Task missing userEmail:", doc.id);
      continue;
    }

    const msg = {
      to: userEmail,
      from: "jbullock6@uco.edu", // 🔐 must match verified sender
      subject: `Reminder: ${task.taskTitle}`,
      text: `Hey there!\n\nJust a friendly reminder for your task:\n"${task.taskTitle}"\nDue on: ${task.dueDate.toDate().toLocaleString()}`,
    };
    

    try {
      await sgMail.send(msg);
      await db.collection("ToDo").doc(doc.id).update({ reminderSent: true });
      console.log(`✅ Reminder sent to ${userEmail} for: ${task.taskTitle}`);
    } catch (error) {
      console.error(`❌ Failed to send for ${userEmail}:`, error.message);
    }
  }
}

sendReminders().catch(console.error);
