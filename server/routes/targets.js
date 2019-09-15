import express from 'express';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const targets = await req.context.models.Target.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.send(targets);
});

router.post('/', auth, async (req, res) => {
  const target = await req.context.models.Target.create({
    name: req.body.name,
    baselineProbesNumber: req.body.baselineProbesNumber,
    dailyProbesStreak: req.body.dailyProbesStreak,
    ownerId: req.user.id,
    sheetId: req.body.sheetId,
  });

  return res.send(target);
});

router.delete('/:targetId', auth, async (req, res) => {
  await req.context.models.Target.destroy({
    where: {
      id: req.params.targetId,
      ownerId: req.user.id,
    },
  });

  return res.send(true);
});

module.exports = router;
