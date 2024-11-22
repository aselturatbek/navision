const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'navision-nv.appspot.com',
});

const db = admin.firestore();
const storage = admin.storage().bucket(); 
module.exports = { admin, db,storage };
