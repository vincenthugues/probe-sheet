import express from 'express';

import auth from '../middleware/auth';
import checkIsValidated from '../middleware/checkIsValidated';
import { getVisibleSheetIds, getEditableSheetIds } from './utils';

const TARGET_FIELDS = ['id', 'name', 'baselineProbesNumber', 'dailyProbesStreak', 'ownerId', 'sheetId', 'createdAt'];

const router = express.Router();

router.get('/', auth, checkIsValidated, async (req, res) => {
  try {
    const sheetId = Number(req.query.sheetId);
    const userId = Number(req.user.id);
    const { models: { Sheet, Target } } = req.context;

    const allowedSheetIds = await getVisibleSheetIds(req);
    const sheet = await Sheet.findOne({
      attributes: ['id', 'ownerId'],
      where: { id: sheetId },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== userId && !allowedSheetIds.includes(sheetId)) {
      return res.status(403).send();
    }

    const targets = await Target.findAll({
      attributes: TARGET_FIELDS,
      where: {
        sheetId,
      },
    });

    return res.send(targets);
  } catch (err) {
    console.log('Error while getting targets:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, checkIsValidated, async (req, res) => {
  try {
    const sheetId = Number(req.body.sheetId);
    const { name, baselineProbesNumber, dailyProbesStreak } = req.body;
    const userId = Number(req.user.id);
    const { models: { Sheet, Target } } = req.context;

    const allowedSheetIds = await getEditableSheetIds(req);
    const sheet = await Sheet.findOne({
      attributes: ['id', 'ownerId'],
      where: { id: sheetId },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== userId && !allowedSheetIds.includes(sheetId)) {
      return res.status(403).send();
    }

    const target = await Target.create({
      name,
      baselineProbesNumber,
      dailyProbesStreak,
      ownerId: userId,
      sheetId,
    });

    return res.send(target);
  } catch (err) {
    console.log('Error while creating target:', err);
    return res.status(400).send(err);
  }
});

// router.delete('/:targetId', auth, checkIsValidated, async (req, res) => {
//   try {
//     const { models: { Target } } = req.context;

//     await Target.destroy({
//       where: {
//         id: req.params.targetId,
//         ownerId: req.user.id,
//       },
//     });

//     return res.send(true);
//   } catch (err) {
//     console.log('Error while deleting target:', err);
//     return res.status(400).send(err);
//   }
// });

module.exports = router;
