const jwt = require('jsonwebtoken');
const { getFirestore } = require('firebase-admin/firestore');

const firestore = getFirestore();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userDoc = await firestore.collection('userInfo').doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = {
      uid: decoded.uid,
      ...userDoc.data(),
    };

    next(); // Middleware başarılıysa devam et
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
