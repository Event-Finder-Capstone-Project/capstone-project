const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// SendGrid API key here
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEventEmail = functions.firestore
    .document("users/{userId}")
    .onUpdate((change, context) => {
      const beforeData = change.before.data();
      const afterData = change.after.data();


        // Check if an event has been added
        console.log("Function triggered!");
        if (afterData.events.length > beforeData.events.length) {
            console.log("Event added detected!");

            const msg = {
                to: afterData.email,
                from: 'eventpulse2@gmail.com',
                templateId: 'd-aede448302fe4cae8ad9101568ab688b',
                dynamicTemplateData: {
                    name: afterData.name,
            }
        };

            return sgMail.send(msg).catch(error => {
                console.error('There was an error sending the email', error);
            });
        } else if (afterData.events.length < beforeData.events.length) {
            console.log("Removed Event detected!");

            const msg = {
                to: afterData.email,
                from: 'eventpulse2@gmail.com',
                templateId: 'd-c73ec11d87e74b81a70c3fa9ee4cfcac',
                dynamicTemplateData: {
                    name: afterData.name,
                }
            };

            return sgMail.send(msg).catch(error => {
                console.error('There was an error sending the email', error);
            });
        } else {
            console.log("No change in events detected.");
        }

        // If no event was added or removed, simply return without doing anything
        return null;

    });

