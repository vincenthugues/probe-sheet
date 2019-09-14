import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    if (!username || !email || !password) {
      console.log('Missing required field(s)');
      return res.status(400).json({
        msg: 'Missing required field(s)',
      });
    }

    const existingUser = await req.context.models.User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        msg: 'User already exists',
      });
    }

    await bcrypt.genSalt(saltRounds, async (err1, salt) => {
      if (err1) throw err1;

      await bcrypt.hash(password, salt, async (err2, hash) => {
        if (err2) throw err2;

        const newUser = await req.context.models.User.create({
          username,
          email,
          password: hash,
        });

        jwt.sign(
          { id: newUser.id },
          process.env.JWT_SECRET,
          {
            expiresIn: 24 * 3600,
          },
          (err3, token) => {
            if (err3) throw err3;

            res.json({
              token,
              user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
              },
            });
          },
        );
      });
    });

    return res.status(200);
  } catch (err) {
    console.log('error:', err);
    return res.status(400).json({
      msg: 'An error occurred while creating the user',
    });
  }
});

router.get('/:userId', auth, async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

module.exports = router;
