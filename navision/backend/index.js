const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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


app.use('/api/posts', postsRoutes);
app.use('/api/auth', registerRoute);
app.use('/api/auth', loginRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
