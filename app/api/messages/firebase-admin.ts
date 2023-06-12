import * as admin from 'firebase-admin';

const serviceAccount = require("./medichat-6f109-firebase-adminsdk-g5094-e0498808e6.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "<database>.firebaseio.com",
    });
}

export const messaging = admin.messaging()