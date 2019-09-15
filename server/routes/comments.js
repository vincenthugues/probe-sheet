import express from 'express';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const comments = await req.context.models.Comment.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.send(comments);
});

router.post('/', auth, async (req, res) => {
  const comment = await req.context.models.Comment.create({
    text: req.body.text,
    ownerId: req.user.id,
    probeId: req.body.probeId,
  });

  res.send(comment);
});

module.exports = router;
