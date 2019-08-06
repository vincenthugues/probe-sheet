import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await req.context.models.User.findByPk(
    req.context.user.id,
  );
  return res.send(user);
});

module.exports = router;
