import db from '../utils/dbConnect';

const findAdminByUniqueId = async (uuid: string) => {
  const admin = await db.admin.findFirst({
    where: {
      uuid,
    },
  });
  return admin;
};
const findAdminById = async (adminId: string) => {
  const admin = await db.admin.findUnique({
    where: {
      id: adminId,
    },
  });
  return admin;
};

export { findAdminByUniqueId, findAdminById };
