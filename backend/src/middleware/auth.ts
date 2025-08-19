import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { MysqlConnection } from "src/db/mysqlConnection";
import { usersTable } from "src/db/schema";
import { eq } from "drizzle-orm";

interface User {
  id: number;
  username: string;
  password: string;
  role_id: number;
  provinsi_id: number | null;
  kabupaten_id: number | null;
  kecamatan_id: number | null;
  kelurahan_id: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer)
    return res.status(401).json({ error: "Access Denied, token missing" });

  const token = bearer.split("Bearer ")[1];

  const payload = verify(token, process.env.JWT_SECRET!) as {
    username: string;
  };

  const db = MysqlConnection.getDbInstance();

  const user = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      password: usersTable.password,
      role_id: usersTable.role_id,
      provinsi_id: usersTable.provinsi_id,
      kabupaten_id: usersTable.kabupaten_id,
      kecamatan_id: usersTable.kecamatan_id,
      kelurahan_id: usersTable.kelurahan_id,
    })
    .from(usersTable)
    .where(eq(usersTable.username, payload.username))
    .limit(1);

  if (user.length === 0)
    return res.status(401).json({ error: "User not found" });

  const selectedUser = user[0];

  req.user = {
    id: selectedUser.id,
    username: selectedUser.username,
    password: selectedUser.password,
    role_id: selectedUser.role_id,
    provinsi_id: selectedUser.provinsi_id,
    kabupaten_id: selectedUser.kabupaten_id,
    kecamatan_id: selectedUser.kecamatan_id,
    kelurahan_id: selectedUser.kelurahan_id,
  };

  next();
};
