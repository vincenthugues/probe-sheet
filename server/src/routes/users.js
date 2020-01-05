import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import auth from '../middleware/auth';
import checkIsAdmin from '../middleware/checkIsAdmin';

const USER_FIELDS = ['id', 'username', 'email', 'role', 'isValidated'];

const router = express.Router();

router.get('/', auth, checkIsAdmin, async (req, res) => {
  const { models: { User } } = req.context;

  const users = await User.findAll({
    attributes: USER_FIELDS,
  });
  return res.send(users);
});

const createUserWithToken = async (User, username, password, email) => {
  const saltRounds = 10;

  const newUserWithToken = await bcrypt.genSalt(saltRounds, (err1, salt) => {
    if (err1) throw err1;

    return bcrypt.hash(password, salt, async (err2, hash) => {
      if (err2) throw err2;

      const newUser = await User.create({
        username,
        email,
        password: hash,
      }, {
        returning: USER_FIELDS,
      });

      const { id, role, isValidated } = newUser.dataValues;

      const token = jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: 24 * 3600 },
      );

      return {
        token,
        user: {
          id,
          username,
          email,
          role,
          isValidated,
        },
      };
    });
  });

  return newUserWithToken;
};

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { models: { User } } = req.context;

    if (!username || !email || !password) {
      console.log('Missing one of required field(s) username, email, password');
      return res.status(400).send({
        msg: 'Missing one of required field(s) username, email, password',
      });
    }

    const existingUser = await User.findOne({
      attributes: ['id'],
      where: { email },
    });
    if (existingUser) {
      console.log('A user with this email already exists');
      return res.status(400).send({
        msg: 'A user with this email already exists',
      });
    }

    const newUserWithToken = await createUserWithToken(User, username, password, email);
    return res.status(200).send(newUserWithToken);
  } catch (err) {
    console.log('Error while creating user:', err);
    return res.status(400).send(err);
  }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const { models: { User } } = req.context;

    const user = await User.findByPk(req.params.userId, { attributes: USER_FIELDS });
    return res.send(user);
  } catch (err) {
    console.log('Error while getting user:', err);
    return res.status(400).send(err);
  }
});

router.post('/:userId/validate', auth, checkIsAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { models: { User } } = req.context;

    if (!userId) {
      return res.status(400).send({ msg: 'Missing required userId' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ msg: 'User not found' });
    }

    if (user.isValidated) {
      return res.status(400).send({ msg: 'User already validated' });
    }

    const updatedUser = await user.update({ isValidated: true }, { returning: USER_FIELDS });

    return res.send(updatedUser);
  } catch (err) {
    console.log('Error while validating user:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
