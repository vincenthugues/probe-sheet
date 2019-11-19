import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import auth from '../middleware/auth';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Missing required field(s)' });
    }

    const existingUser = await req.context.models.User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    jwt.sign(
      {
        id: existingUser.id,
        email,
        role: existingUser.role,
        isValidated: existingUser.isValidated,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 24 * 3600,
      },
      (err, token) => {
        if (err) throw err;

        res.json({
          token,
          user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            isValidated: existingUser.isValidated,
          },
        });
      },
    );

    return res.status(200);
  } catch (err) {
    console.log('error:', err);
    return res.status(400).json({
      msg: 'An error occurred while authenticating the user',
    });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(
      req.user.id,
      {
        attributes: [
          'id',
          'username',
          'email',
          'role',
          'isValidated',
        ],
      },
    );

    return res.send(user);
  } catch (err) {
    console.log('error:', err);
    return res.status(400).json({
      msg: 'An error occurred while getting the authenticated user',
    });
  }
});

module.exports = router;
