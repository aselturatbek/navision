const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Firebase yapılandırması

// Postları Getiren Endpoint
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('posts').get(); // Firestore'dan postları getir
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts); // Postları JSON olarak döndür
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// Yeni Post Oluşturma Endpoint'i
router.post('/', async (req, res) => {
  const { userId, content } = req.body; // İstekten userId ve content'i al
  try {
    const newPost = await db.collection('posts').add({
      userId,
      content,
      timestamp: new Date(),
    }); // Yeni postu Firestore'a ekle
    res.status(201).json({ id: newPost.id, message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

module.exports = router;
