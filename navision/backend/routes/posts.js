const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Firebase yapılandırması
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware
const { Timestamp } = require('firebase-admin/firestore'); // Firestore Timestamp

// Tüm postları alma
router.get('/', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('posts').get();
    const posts = postsSnapshot.docs.map((doc) => {
      const data = doc.data();

      // Firestore'dan direkt profileImage ve mediaUrls kullanılıyor
      return {
        id: doc.id,
        ...data,
      };
    });

    const sortedPosts = posts.sort(
      (a, b) => new Date(b.timestamp?.seconds * 1000 || b.timestamp) - new Date(a.timestamp?.seconds * 1000 || a.timestamp)
    );

    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Yeni bir post oluşturma (timestamp eklenmiş)
router.post('/create', authMiddleware, async (req, res) => {
  const { content, mediaUrls, profileImage } = req.body;

  try {
    const newPost = {
      content,
      mediaUrls: mediaUrls || [], // Medya URL'leri direkt saklanır
      profileImage: profileImage || '', // Profil resmi URL'si direkt saklanır
      timestamp: Timestamp.now(), // Zaman damgası
      likedBy: [],
      likes: 0,
    };

    const postRef = await db.collection('posts').add(newPost);
    const post = await postRef.get();

    res.status(201).json({ id: post.id, ...post.data() });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Bir postu beğenme
router.post('/like', authMiddleware, async (req, res) => {
  const { postId } = req.body;

  try {
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = postDoc.data();
    const likedBy = postData.likedBy || [];
    const isLiked = likedBy.includes(req.user.username);

    const updatedLikedBy = isLiked
      ? likedBy.filter((username) => username !== req.user.username)
      : [...likedBy, req.user.username];

    await postRef.update({
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length,
    });

    res.status(200).json({
      message: isLiked ? 'Like removed' : 'Post liked',
      likes: updatedLikedBy.length,
      likedBy: updatedLikedBy, // Frontend için likedBy verisini sağla
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Error liking post' });
  }
});

module.exports = router;
