const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

console.log('API_BASE_URL:', process.env.API_BASE_URL);
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Routes
const postsRoutes = require('./routes/posts');
const registerRoute = require('./routes/auth/register'); 
const loginRoute = require('./routes/auth/login'); 
const refreshTokenRoute = require('./routes/auth/refreshToken'); 


app.use('/api/posts', postsRoutes);
app.use('/api/auth', registerRoute);
app.use('/api/auth', loginRoute);
app.use('/api/auth/refresh-token', refreshTokenRoute);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
