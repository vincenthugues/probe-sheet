import express from 'express';
import { Op } from 'sequelize';

import auth from '../middleware/auth';
import { getVisibleSheetIds } from './utils';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const allowedSheetIds = await getVisibleSheetIds(req);
    const sheets = await req.context.models.Sheet.findAll({
      where: {
        [Op.or]: [
          { ownerId: req.user.id },
          { id: { [Op.in]: allowedSheetIds } },
        ],
      },
    });

    return res.send(sheets);
  } catch (err) {
    console.log('Error while getting sheets:', err);
    return res.status(400).send(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const sheet = await req.context.models.Sheet.create({
      student: req.body.student,
      skillDomain: req.body.skillDomain,
      ownerId: req.user.id,
    });

    return res.send(sheet);
  } catch (err) {
    console.log('Error while creating sheet:', err);
    return res.status(400).send(err);
  }
});

router.get('/:sheetId', auth, async (req, res) => {
  try {
    const sheetId = Number(req.params.sheetId);
    const allowedSheetIds = await getVisibleSheetIds(req);
    const sheet = await req.context.models.Sheet.findOne({
      where: { id: sheetId },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== req.user.id && !allowedSheetIds.includes(sheetId)) {
      return res.status(403).send();
    }

    return res.send(sheet);
  } catch (err) {
    console.log('Error while getting sheet:', err);
    return res.status(400).send(err);
  }
});

// router.delete('/:sheetId', auth, async (req, res) => {
//   try {
//     await req.context.models.Sheet.destroy({
//       where: {
//         id: req.params.sheetId,
//         ownerId: req.user.id,
//       },
//     });

//     return res.send(true);
//   } catch (err) {
//     console.log('Error while deletting sheet:', err);
//     return res.status(400).send(err);
//   }
// });

router.get('/:sheetId/access-rights', auth, async (req, res) => {
  try {
    const { sheetId } = req.params;
    const accessRights = await req.context.models.AccessRight.findAll({
      where: {
        sheetId,
      },
      attributes: ['email', 'role'],
      // include: [{
      //   model: req.context.models.User,
      //   attributes: ['id', 'email', 'username'],
      // }],
    });
    const sheetUserRights = accessRights.map(
      ({ dataValues }) => (dataValues),
    );

    return res.send(sheetUserRights);
  } catch (err) {
    console.log('Error while getting sheet access rights:', err);
    return res.status(400).send(err);
  }
});

router.post('/:sheetId/access-rights', auth, async (req, res) => {
  try {
    const sheetId = Number(req.params.sheetId);
    const { email, role } = req.body;

    const sheet = await req.context.models.Sheet.findOne({
      where: { id: sheetId },
    });
    if (!sheet) {
      return res.status(404).send();
    }
    if (sheet.ownerId !== req.user.id) {
      return res.status(403).send();
    }

    const accessRight = await req.context.models.AccessRight.create({
      sheetId,
      email,
      role,
    });

    return res.send(accessRight);
  } catch (err) {
    console.log('Error while creating sheet access right:', err);
    return res.status(400).send(err);
  }
});

module.exports = router;
