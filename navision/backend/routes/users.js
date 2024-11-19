const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); 

// Tüm kullanıcıları getiren rota
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('userInfo').get(); // Firestore'dan userInfo koleksiyonunu getir
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No users found' }); // Kullanıcı bulunmazsa
    }

    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users); // JSON formatında kullanıcıları döndür
  } catch (error) {
    console.error('Error fetching users:', error); // Hata loglama
    res.status(500).json({ message: 'An error occurred while fetching users' });
  }
});
router.get('/test', (req, res) => {
  res.send('Users route is working!');
});


module.exports = router;
