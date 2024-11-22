const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getFirestore } = require('firebase-admin/firestore');

const firestore = getFirestore();

// Kullanıcı bilgilerini alma
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userDoc = await firestore.collection('userInfo').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.status(200).json({
      uid: req.user.uid,
      username: userData.username,
      profileImage: userData.profileImage || 'https://via.placeholder.com/150',
      email: userData.email,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
