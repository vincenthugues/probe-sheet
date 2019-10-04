import express from 'express';
import { Op } from 'sequelize';

import auth from '../middleware/auth';
import { getAllowedSheetIds } from './utils';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { query: { sheetId: querySheetId } } = req;
    const allowedSheetIds = await getAllowedSheetIds(req);
    const targets = await req.context.models.Target.findAll({
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { sheetId: { [Op.in]: allowedSheetIds } },
        ],
        ...querySheetId ? { sheetId: querySheetId } : {},
      },
    });

    return res.send(targets);
  } catch (err) {
    console.log('Error while getting targets:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const target = await req.context.models.Target.create({
      name: req.body.name,
      baselineProbesNumber: req.body.baselineProbesNumber,
      dailyProbesStreak: req.body.dailyProbesStreak,
      ownerId: req.user.id,
      sheetId: req.body.sheetId,
    });

    return res.send(target);
  } catch (err) {
    console.log('Error while creating target:', err);
    return res.status(400).send(err);
  }
});

router.delete('/:targetId', auth, async (req, res) => {
  try {
    await req.context.models.Target.destroy({
      where: {
        id: req.params.targetId,
        ownerId: req.user.id,
      },
    });

    return res.send(true);
  } catch (err) {
    console.log('Error while deleting target:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
