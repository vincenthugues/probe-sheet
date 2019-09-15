import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import auth from '../middleware/auth';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing required field(s)');
      return res.status(400).json({
        msg: 'Missing required field(s)',
      });
    }

    const existingUser = await req.context.models.User.findOne({ where: { email } });
    if (!existingUser) {
      console.log('User not found');
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({
        msg: 'Invalid credentials',
      });
    }

    jwt.sign(
      { id: existingUser.id },
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
          'createdAt',
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
