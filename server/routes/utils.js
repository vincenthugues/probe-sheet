export default async (req) => {
  const accessRights = await req.context.models.AccessRight.findAll({
    where: {
      email: req.user.email,
    },
  });
  const rights = accessRights.map(({ dataValues: { sheetId, role } }) => ({ sheetId, role }));
  const allowedSheetIds = rights.map(({ sheetId }) => sheetId);

  return allowedSheetIds;
};
