import express from 'express'; // Use ES module import
const router = express.Router();

router.get('/profile', (req, res) => {
  const user = {
    fullname: 'John Doe',
    email: 'john@example.com'
  };
  res.json({ user });
});

export default router; // Use ES module export