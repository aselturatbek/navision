const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Firebase Admin SDK
const firestore = getFirestore();
const auth = getAuth();

router.post('/register', async (req, res) => {
  const { email, password, username, phoneNumber, name, surname, dateOfBirth, gender } = req.body;

  try {
    // Tüm alanları kontrol et
    if (!email || !password || !username || !phoneNumber || !name || !dateOfBirth || !gender) {
      console.error('Eksik bilgi gönderildi:', req.body);
      return res.status(400).json({ error: 'Lütfen tüm bilgileri doldurun.' });
    }

    // Email doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Geçersiz email adresi:', email);
      return res.status(400).json({ error: 'Geçerli bir email adresi girin.' });
    }

    // Şifre doğrulama
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~|\\])[A-Za-z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~|\\]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('Geçersiz şifre formatı:', password);
      return res.status(400).json({ error: 'Şifre en az 8 karakter, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir.' });
    }

    // Kullanıcı adı kontrolü
    const userDocs = await firestore.collection('userInfo').where('username', '==', username).get();
    if (!userDocs.empty) {
      console.error('Kullanıcı adı zaten alınmış:', username);
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış.' });
    }

    // E-posta adresinin daha önce kayıtlı olup olmadığını kontrol et
    try {
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        console.error('E-posta zaten kayıtlı:', email);
        return res.status(400).json({ error: 'Bu e-posta adresiyle daha önce kayıt olunmuş.' });
      }
    } catch (err) {
      // Eğer hata "auth/user-not-found" ise sorun yok, devam edebiliriz
      if (err.code === 'auth/user-not-found') {
        console.log('E-posta kontrolü: Kullanıcı bulunamadı, kayıt yapılabilir:', email);
      } else {
        console.error('E-posta kontrolü sırasında bir hata oluştu:', err);
        throw err; // Başka bir hata varsa işleme devam etme
      }
    }

    // Firebase Authentication'da kullanıcı oluştur
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      });
    } catch (error) {
      console.error('Firebase kullanıcı oluşturma hatası:', error);
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ error: 'Bu e-posta adresiyle daha önce kayıt olunmuş.' });
      }
      throw error; // Diğer hataları fırlat
    }

    // Kullanıcı bilgilerini Firestore'da sakla
    try {
      await firestore.collection('userInfo').doc(userRecord.uid).set({
        username,
        phoneNumber,
        email,
        name,
        surname: surname || '',
        dateOfBirth,
        gender,
        biography: '',
        profileImage: '',
      });
    } catch (error) {
      console.error('Firestore kullanıcı bilgilerini kaydetme hatası:', error);
      throw error;
    }

    // Başarı yanıtı döndür
    res.status(201).json({
      message: 'Kayıt başarılı!',
    });
  } catch (error) {
    console.error('Kayıt sırasında bir hata oluştu:', error);
    res.status(500).json({ error: 'Sunucuda bir hata oluştu. Daha sonra tekrar deneyin.' });
  }
});

module.exports = router;
