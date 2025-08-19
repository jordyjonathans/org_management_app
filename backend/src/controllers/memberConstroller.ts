import { RequestHandler } from "express";
import { MysqlConnection } from "src/db/mysqlConnection";
import {
  kabupatenTable,
  kecamatanTable,
  kelurahanTable,
  membersTable,
  usersTable,
} from "src/db/schema";
import bcrypt, { compare } from "bcrypt";
import { and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { sign } from "jsonwebtoken";

export const createMember: RequestHandler = async (req, res) => {
  const {
    no_ktp,
    nama,
    no_hp,
    provinsi_id,
    kabupaten_id,
    kecamatan_id,
    kelurahan_id,
  } = req.body;

  if (
    !no_ktp ||
    !nama ||
    !no_hp ||
    !provinsi_id ||
    !kabupaten_id ||
    !kecamatan_id ||
    !kelurahan_id
  )
    return res
      .status(400)
      .json({ status: "N", message: "All fields required" });

  const db = MysqlConnection.getDbInstance();

  const existingMember = await db
    .select({ id: membersTable.id })
    .from(membersTable)
    .where(or(eq(membersTable.no_ktp, no_ktp), eq(membersTable.no_hp, no_hp)))
    .limit(1);

  if (existingMember.length > 0)
    return res
      .status(400)
      .json({ status: "N", message: "Cannot use same KTP or No HP" });

  await db.insert(membersTable).values({
    no_ktp,
    nama,
    no_hp,
    provinsi_id,
    kabupaten_id,
    kecamatan_id,
    kelurahan_id,
  });

  return res
    .status(201)
    .json({ status: "Y", message: "Register member success" });
};

export const getMembers: RequestHandler = async (req, res) => {
  const { role_id, provinsi_id, kabupaten_id, kecamatan_id, kelurahan_id } =
    req.user;

  const { page, total } = req.body;

  const db = MysqlConnection.getDbInstance();

  let members;

  if (role_id === 1) {
    members = await db
      .select({
        no_ktp: membersTable.no_ktp,
        nama: membersTable.nama,
        no_hp: membersTable.no_hp,
        provinsi_id: membersTable.provinsi_id,
        kabupaten_id: membersTable.kabupaten_id,
        kecamatan_id: membersTable.kecamatan_id,
        kelurahan_id: membersTable.kelurahan_id,
        createdAt: membersTable.createdAt,
      })
      .from(membersTable);
  } else if (provinsi_id)
    members = await getRekapitulasiProvinsi(provinsi_id, page, total);
  else if (kabupaten_id)
    members = await getRekapitulasiKabupaten(kabupaten_id, page, total);
  else if (kecamatan_id)
    members = await getRekapitulasiKecamatan(kecamatan_id, page, total);
  else if (kelurahan_id)
    members = await getRekapitulasiKelurahan(kelurahan_id, page, total);
  else res.status(401).json({ status: "N", message: "User Unauthorized" });

  if (members && members.length === 0)
    return res.status(200).json({ status: "N", message: "Data not found" });

  return res.status(200).json({
    status: "Y",
    data: members,
  });
};
const getRekapitulasiProvinsi = async (
  provinsi_id: number,
  page: number,
  total: number
) => {
  const db = MysqlConnection.getDbInstance();
  const offset = (page - 1) * total;
  const members = await db
    .select({
      kabupaten_name: kabupatenTable.name,
      total: sql`COALESCE(COUNT(${membersTable.id}), 0)`.as("total"),
    })
    .from(membersTable)
    .leftJoin(kabupatenTable, eq(membersTable.kabupaten_id, kabupatenTable.id))
    .where(eq(membersTable.provinsi_id, provinsi_id))
    .groupBy(membersTable.kabupaten_id, kabupatenTable.name)
    .orderBy(asc(kabupatenTable.name))
    .limit(total)
    .offset(offset);

  return members;
};

const getRekapitulasiKabupaten = async (
  kabupaten_id: number,
  page: number,
  total: number
) => {
  const db = MysqlConnection.getDbInstance();
  const offset = (page - 1) * total;
  const members = await db
    .select({
      kecamatan_name: kecamatanTable.name,
      total: sql`COALESCE(COUNT(${membersTable.id}), 0)`.as("total"),
    })
    .from(membersTable)
    .leftJoin(kecamatanTable, eq(membersTable.kecamatan_id, kecamatanTable.id))
    .where(eq(membersTable.kabupaten_id, kabupaten_id))
    .groupBy(membersTable.kecamatan_id, kecamatanTable.name)
    .orderBy(asc(kecamatanTable.name))
    .limit(total)
    .offset(offset);

  return members;
};

const getRekapitulasiKecamatan = async (
  kecamatan_id: number,
  page: number,
  total: number
) => {
  const db = MysqlConnection.getDbInstance();
  const offset = (page - 1) * total;
  const members = await db
    .select({
      kelurahan_name: kelurahanTable.name,
      total: sql`COALESCE(COUNT(${membersTable.id}), 0)`.as("total"),
    })
    .from(membersTable)
    .leftJoin(kelurahanTable, eq(membersTable.kelurahan_id, kelurahanTable.id))
    .where(eq(membersTable.kecamatan_id, kecamatan_id))
    .groupBy(membersTable.kelurahan_id, kelurahanTable.name)
    .orderBy(asc(kelurahanTable.name))
    .limit(total)
    .offset(offset);

  return members;
};

const getRekapitulasiKelurahan = async (
  kelurahan_id: number,
  page: number,
  total: number
) => {
  const db = MysqlConnection.getDbInstance();
  const offset = (page - 1) * total;
  const members = await db
    .select({
      no_ktp: membersTable.no_ktp,
      nama: membersTable.nama,
      no_hp: membersTable.no_hp,
      provinsi_id: membersTable.provinsi_id,
      kabupaten_id: membersTable.kabupaten_id,
      kecamatan_id: membersTable.kecamatan_id,
      kelurahan_id: membersTable.kelurahan_id,
      createdAt: membersTable.createdAt,
    })
    .from(membersTable)
    .where(eq(membersTable.kelurahan_id, kelurahan_id))
    .orderBy(desc(membersTable.createdAt))
    .limit(total)
    .offset(offset);

  return members;
};
