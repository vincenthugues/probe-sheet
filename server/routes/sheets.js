import express from 'express';

import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const sheets = await req.context.models.Sheet.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.send(sheets);
});

router.get('/:sheetId', auth, async (req, res) => {
  const sheet = await req.context.models.Sheet.findOne({
    where: {
      id: req.params.sheetId,
      ownerId: req.user.id,
    },
  });
  return res.send(sheet);
});

router.post('/', auth, async (req, res) => {
  const sheet = await req.context.models.Sheet.create({
    student: req.body.student,
    skillDomain: req.body.skillDomain,
    ownerId: req.user.id,
  });

  return res.send(sheet);
});

router.delete('/:sheetId', auth, async (req, res) => {
  await req.context.models.Sheet.destroy({
    where: {
      id: req.params.sheetId,
      ownerId: req.user.id,
    },
  });

  return res.send(true);
});

module.exports = router;
