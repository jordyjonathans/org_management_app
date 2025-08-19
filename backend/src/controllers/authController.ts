import { RequestHandler } from "express";
import { MysqlConnection } from "src/db/mysqlConnection";
import { usersTable } from "src/db/schema";
import bcrypt, { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";

export const signUp: RequestHandler = async (req, res) => {
  const {
    username,
    password,
    role_id,
    provinsi_id,
    kabupaten_id,
    kecamatan_id,
    kelurahan_id,
  } = req.body;

  const session_role_id = req.user.role_id;

  if (session_role_id !== 1)
    return res.status(403).json({ status: "N", message: "Forbidden Access" });

  if (!username || !password || !role_id)
    return res
      .status(400)
      .json({ status: "N", message: "All fields required" });

  const db = MysqlConnection.getDbInstance();

  const existingUser = await db
    .select({ username: usersTable.username })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (existingUser.length > 0)
    return res
      .status(401)
      .json({ status: "N", message: "User already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(usersTable).values({
    username: username,
    password: hashedPassword,
    role_id: role_id,
    provinsi_id: provinsi_id,
    kabupaten_id: kabupaten_id,
    kelurahan_id: kelurahan_id,
    kecamatan_id: kecamatan_id,
  });

  return res.status(201).json({ status: "Y", message: "Sign up success" });
};

export const singIn: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ status: "N", message: "All fields required" });

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
    .where(eq(usersTable.username, username))
    .limit(1);

  if (user.length === 0)
    return res.status(401).json({ status: "N", message: "User not found" });

  const selectedUser = user[0];

  const isValid = await bcrypt.compare(password, selectedUser.password);

  if (!isValid)
    return res
      .status(401)
      .json({ status: "N", message: "Email/password is wrong" });

  const jwtToken = sign(
    {
      username: selectedUser.username,
      role_id: selectedUser.role_id,
      provinsi_id: selectedUser.provinsi_id,
      kabupaten_id: selectedUser.kabupaten_id,
      kelurahan_id: selectedUser.kelurahan_id,
      kecamatan_id: selectedUser.kecamatan_id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    status: "Y",
    token: jwtToken,
    message: "Login success",
    user: {
      id: selectedUser.id,
      username: selectedUser.username,
      role_id: selectedUser.role_id,
      provinsi_id: selectedUser.provinsi_id,
      kabupaten_id: selectedUser.kabupaten_id,
      kelurahan_id: selectedUser.kelurahan_id,
      kecamatan_id: selectedUser.kecamatan_id,
    },
  });
};
