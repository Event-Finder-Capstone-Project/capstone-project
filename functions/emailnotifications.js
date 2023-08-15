const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// SendGrid API key here
sgMail.setApiKey(functions.config().sendgrid.key);


exports.sendEventNotification = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        const beforeData = change.before.data();
        const afterData = change.after.data();

        // Check if an event has been added
        if (afterData.events.length > beforeData.events.length) {
            const msg = {
                to: afterData.email,
                from: 'no-reply@yourapp.com',
                subject: 'New Event Added',
                text: `Hello ${afterData.name}, You've added a new event to your calendar.`,
            };

            return sgMail.send(msg).catch(error => {
                console.error('There was an error sending the email', error);
            });
        }

        // If no new event was added, simply return without doing anything
        return null;
    });
