const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getFirestore } = require('firebase-admin/firestore');

// firestore
const firestore = getFirestore();

// token sureleri
const ACCESS_TOKEN_EXPIRY = '15m'; 
const REFRESH_TOKEN_EXPIRY = '7d'; 

// refresh-token endpointi
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token gerekli.' });
  }

  try {
    //refresh token verify et
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    //veritabanindan refresh tokeni kontrol et
    const storedToken = await firestore.collection('refreshTokens').doc(decoded.uid).get();

    if (!storedToken.exists || storedToken.data().refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Geçersiz refresh token.' });
    }

    //yeni access-refresh token olusturma
    const newAccessToken = jwt.sign({ uid: decoded.uid }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const newRefreshToken = jwt.sign({ uid: decoded.uid }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    //refresh token yenileme
    await firestore.collection('refreshTokens').doc(decoded.uid).set({ refreshToken: newRefreshToken });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token yenileme hatası:', error);
    res.status(403).json({ error: 'Refresh token geçersiz veya süresi dolmuş.' });
  }
});

module.exports = router;
