import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get('/:userId', async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

router.post('/', async (req, res) => {
  const user = await req.context.models.User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.send(user);
});

module.exports = router;
