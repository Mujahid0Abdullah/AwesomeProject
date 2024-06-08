const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendAppointmentNotification = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data();
    const doktorEmail = newValue.doktorEmail;

    // Doktorun cihaz token'ını alın
    const userSnapshot = await admin.firestore().collection('users').where('email', '==', doktorEmail).get();
    if (userSnapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const token = userDoc.data().token;

    // Bildirimi gönderin
    const message = {
      notification: {
        title: 'Yeni Randevu',
        body: `${newValue.patientdisplayName} ile ${newValue.time} tarihinde randevunuz var.`,
      },
      token: token,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
