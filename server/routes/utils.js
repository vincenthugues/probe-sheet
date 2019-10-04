import { Op } from 'sequelize';

export const getAllowedSheetIds = async (req) => {
  const accessRights = await req.context.models.AccessRight.findAll({
    where: {
      email: req.user.email,
    },
  });
  const rights = accessRights.map(({ dataValues: { sheetId, role } }) => ({ sheetId, role }));
  const allowedSheetIds = rights.map(({ sheetId }) => sheetId);

  return allowedSheetIds;
};

export const getAllowedTargetIds = async (req) => {
  const allowedSheetIds = await getAllowedSheetIds(req);
  const allowedTargets = await req.context.models.Target.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { sheetId: { [Op.in]: allowedSheetIds } },
      ],
    },
  });
  const allowedTargetIds = allowedTargets.map(({ dataValues: { id } }) => id);

  return allowedTargetIds;
};

export const getAllowedProbeIds = async (req) => {
  const allowedTargetIds = await getAllowedTargetIds(req);
  const allowedProbes = await req.context.models.Probe.findAll({
    where: {
      [Op.or]: [
        { ownerId: req.user.id },
        { targetId: { [Op.in]: allowedTargetIds } },
      ],
    },
  });
  const allowedProbeIds = allowedProbes.map(({ dataValues: { id } }) => id);

  return allowedProbeIds;
};
