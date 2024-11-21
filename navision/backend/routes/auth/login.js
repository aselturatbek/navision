const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');

// Firebase Admin SDK
const auth = getAuth();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // E-posta ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({ error: 'Lütfen email ve şifre girin.' });
    }

    // Firebase Authentication üzerinden giriş yap
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // Şifre kontrolü (Firebase Admin SDK doğrudan şifre kontrolü yapmaz,
    // bunun için bir JWT oluşturma ve doğrulama işlemi gereklidir)

    // Backend, girişin doğruluğunu kontrol ettiyse, kullanıcı bilgilerini dön
    res.status(200).json({
      message: 'Giriş başarılı!',
      user: {
        email: userRecord.email,
        uid: userRecord.uid,
        username: userRecord.username,
      },
    });
  } catch (error) {
    console.error('Giriş sırasında hata:', error);
    res.status(500).json({ error: 'Sunucuda bir hata oluştu. Lütfen tekrar deneyin.' });
  }
});

module.exports = router;
