const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// firebase
const auth = getAuth();
const firestore = getFirestore();

// token sureleri
const ACCESS_TOKEN_EXPIRY = '15m'; 
const REFRESH_TOKEN_EXPIRY = '7d'; 

router.post('/login', async (req, res) => {
     const { email, password } = req.body;
   
     try {
       //env degiskenleri
       if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
         throw new Error('ACCESS_TOKEN_SECRET ve REFRESH_TOKEN_SECRET tanımlı değil!');
       }
   
       if (!email || !password) {
         return res.status(400).json({ error: 'Lütfen email ve şifre girin.' });
       }
   
       const userRecord = await auth.getUserByEmail(email);
       if (!userRecord) {
         return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
       }
   
       const userDoc = await firestore.collection('userInfo').doc(userRecord.uid).get();
       if (!userDoc.exists) {
         return res.status(404).json({ error: 'Kullanıcı veritabanında bulunamadı.' });
       }
   
       const userData = userDoc.data();

       const accessToken = jwt.sign(
         { uid: userRecord.uid },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: ACCESS_TOKEN_EXPIRY }
       );
       const refreshToken = jwt.sign(
         { uid: userRecord.uid },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: REFRESH_TOKEN_EXPIRY }
       );
   
       await firestore.collection('refreshTokens').doc(userRecord.uid).set({ refreshToken });
   
       // basarili oturum actiginda log
       console.log('Oturum başlatıldı:', {
         user: {
           email: userRecord.email,
           uid: userRecord.uid,
           username: userData.username,
           profileImage: userData.profileImage,
         },
         accessToken,
         refreshToken,
       });
   
       res.status(200).json({
         message: 'Giriş başarılı!',
         accessToken,
         refreshToken,
         user: {
           email: userRecord.email,
           username: userData.username,
           profileImage: userData.profileImage,
           uid: userRecord.uid,
           ...userDoc.data(),
         },
       });
     } catch (error) {
       console.error('Giriş sırasında hata:', error);
       res.status(500).json({ error: error.message || 'Sunucuda bir hata oluştu.' });
     }
   });

module.exports = router;
