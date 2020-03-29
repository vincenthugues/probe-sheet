import express from 'express';

import auth from '../middleware/auth';
import checkIsAdmin from '../middleware/checkIsAdmin';
import { hashPassword, getSignedToken } from './utils';

const USER_FIELDS = ['id', 'username', 'email', 'role', 'isValidated'];

const router = express.Router();

router.get('/', auth, checkIsAdmin, async ({ context }, res) => {
  const { models: { User } } = context;

  const users = await User.findAll({
    attributes: USER_FIELDS,
  });

  return res.send(users);
});

router.post('/', async ({ context, body }, res) => {
  try {
    const { models: { User } } = context;
    const { username, email, password } = body;

    if (!username || !email || !password) {
      console.log('Missing one of required field(s) username, email, password');
      return res.status(400).send({
        msg: 'Missing one of required field(s) username, email, password',
      });
    }

    const matchingUsersByEmail = await User.count({ where: { email } });
    if (matchingUsersByEmail !== 0) {
      console.log('A user with this email already exists');
      return res.status(400).send({
        msg: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      username,
      email,
      password: await hashPassword(password),
    }, {
      returning: USER_FIELDS,
      raw: true,
    });

    const token = getSignedToken(user.id);

    return res.status(200).send({
      user,
      token,
    });
  } catch (err) {
    console.log('Error while creating user:', err);
    return res.status(400).send(err);
  }
});

router.get('/:userId', auth, async ({ context, params }, res) => {
  try {
    const { models: { User } } = context;

    const user = await User.findByPk(params.userId, { attributes: USER_FIELDS });
    return res.send(user);
  } catch (err) {
    console.log('Error while getting user:', err);
    return res.status(400).send(err);
  }
});

router.post('/:userId/validate', auth, checkIsAdmin, async ({ context, params }, res) => {
  try {
    const { models: { User } } = context;
    const { userId } = params;

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
