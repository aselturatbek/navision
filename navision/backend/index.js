const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users'); // Doğru dosya yolunu kontrol edin
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
