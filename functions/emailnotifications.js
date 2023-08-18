// Import necessary Firebase functions and admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Import SendGrid email service
const sgMail = require("@sendgrid/mail");

// Initialize the Firebase admin SDK
admin.initializeApp();

// SendGrid API key here
sgMail.setApiKey(functions.config().sendgrid.key);

// Define a Cloud Firestore trigger for when a user document is updated
exports.sendEventEmail = functions.firestore
    .document("users/{userId}")
    .onUpdate((change, context) => {
        // Get the data from the document before and after the update
      const beforeData = change.before.data();
      const afterData = change.after.data();

      // Check if the number of events has increased (i.e., an event has been added)
        if (afterData.events.length > beforeData.events.length) {

            const msg = {
                // send to the user's email
                to: afterData.email,
                // our verified sender email
                from: 'eventpulse2@gmail.com',
                // SendGrid template for added event
                templateId: 'd-aede448302fe4cae8ad9101568ab688b',
                dynamicTemplateData: {
                // user's name for personalized email content
                    name: afterData.name,
            }
        };
            // Send the email and handle any potential errors
            return sgMail.send(msg).catch(error => {
                console.error('There was an error sending the email', error);
            });
        } else if (afterData.events.length < beforeData.events.length) {
            // Check if the number of events has decreased (i.e., an event has been removed)
            console.log("Removed Event detected!");
            // Define the email message for the removed event
            const msg = {
                to: afterData.email,
                from: 'eventpulse2@gmail.com',
                templateId: 'd-c73ec11d87e74b81a70c3fa9ee4cfcac',
                dynamicTemplateData: {
                    name: afterData.name,
                }
            };
            // Send the email and handle any potential errors
            return sgMail.send(msg).catch(error => {
                console.error('There was an error sending the email', error);
            });
        } else {
            console.log("No change in events detected.");
        }

        // If no event was added or removed, simply return without doing anything
        return null;

    });
