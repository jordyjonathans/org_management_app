import "dotenv/config";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import {
  districtsTable,
  kabupatenTable,
  kecamatanTable,
  kelurahanTable,
  provinsiTable,
  usersTable,
} from "./schema";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  const db = drizzle({ client: connection });

  const provinsi: (typeof provinsiTable.$inferInsert)[] = [
    {
      id: 1,
      name: "DKI Jakarta",
    },
  ];

  const kabupaten: (typeof kabupatenTable.$inferInsert)[] = [
    {
      id: 1,
      name: "Jakarta Pusat",
      provinsi_id: 1,
    },
  ];

  const kecamatan: (typeof kecamatanTable.$inferInsert)[] = [
    {
      id: 1,
      name: "Gambir",
      provinsi_id: 1,
      kabupaten_id: 1,
    },
  ];

  const kelurahan: (typeof kelurahanTable.$inferInsert)[] = [
    {
      id: 1,
      name: "Gambir",
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
    },
    {
      id: 2,
      name: "Kebon Kelapa",
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 2,
    },
    {
      id: 3,
      name: "Petojo Utara",
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 3,
    },
    {
      id: 4,
      name: "Petojo",
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 4,
    },
    {
      id: 5,
      name: "Cideng",
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 5,
    },
  ];

  const districts: (typeof districtsTable.$inferInsert)[] = [
    {
      id: 1,
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
      kelurahan_id: 1,
    },
    {
      id: 2,
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
      kelurahan_id: 2,
    },
    {
      id: 3,
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
      kelurahan_id: 3,
    },
    {
      id: 4,
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
      kelurahan_id: 4,
    },
    {
      id: 5,
      provinsi_id: 1,
      kabupaten_id: 1,
      kecamatan_id: 1,
      kelurahan_id: 5,
    },
  ];

  //   await db.insert(provinsiTable).values(provinsi);
  //   await db.insert(kabupatenTable).values(kabupaten);
  //   await db.insert(kecamatanTable).values(kecamatan);
  //   await db.insert(kelurahanTable).values(kelurahan);
  //   await db.insert(districtsTable).values(districts);

  const hashedPassword = await bcrypt.hash("admin", 10);

  const defaultUser: typeof usersTable.$inferInsert = {
    username: "admin",
    password: hashedPassword,
    role_id: 1,
    provinsi_id: null,
    kabupaten_id: null,
    kecamatan_id: null,
    kelurahan_id: null,
  };

  await db.insert(usersTable).values([defaultUser]);

  //   const users = await db.select().from(usersTable);
  //   console.log('Getting all users from the database: ', users)

  //   await db
  //     .update(usersTable)
  //     .set({
  //       age: 31,
  //     })
  //     .where(eq(usersTable.email, user.email));
  //   console.log('User info updated!')
  //   await db.delete(usersTable).where(eq(usersTable.email, user.email));
  //   console.log('User deleted!')
}

main();
