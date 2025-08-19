import { foreignKey, integer } from "drizzle-orm/gel-core";
import {
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { metaData } from "./metadata";

export const provinsiTable = mysqlTable("provinsi", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ...metaData,
});

export const kabupatenTable = mysqlTable("kabupaten", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  provinsi_id: int("provinsi_id", { unsigned: true })
    .notNull()
    .references(() => provinsiTable.id),
  ...metaData,
});

export const kecamatanTable = mysqlTable("kecamatan", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  provinsi_id: int("provinsi_id", { unsigned: true })
    .notNull()
    .references(() => provinsiTable.id),
  kabupaten_id: int("kabupaten_id", { unsigned: true })
    .notNull()
    .references(() => kabupatenTable.id),
  ...metaData,
});

export const kelurahanTable = mysqlTable("kelurahan", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  provinsi_id: int("provinsi_id", { unsigned: true })
    .notNull()
    .references(() => provinsiTable.id),
  kabupaten_id: int("kabupaten_id", { unsigned: true })
    .notNull()
    .references(() => kabupatenTable.id),
  kecamatan_id: int("kecamatan_id", { unsigned: true })
    .notNull()
    .references(() => kecamatanTable.id),
  ...metaData,
});

export const districtsTable = mysqlTable("districts", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  provinsi_id: int("provinsi_id", { unsigned: true })
    .notNull()
    .references(() => provinsiTable.id),
  kabupaten_id: int("kabupaten_id", { unsigned: true })
    .notNull()
    .references(() => kabupatenTable.id),
  kecamatan_id: int("kecamatan_id", { unsigned: true })
    .notNull()
    .references(() => kecamatanTable.id),
  kelurahan_id: int("kelurahan_id", { unsigned: true })
    .notNull()
    .references(() => kelurahanTable.id),
  ...metaData,
});

export const usersTable = mysqlTable("users", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role_id: int("role_id", { unsigned: true }).notNull(),
  provinsi_id: int("provinsi_id", { unsigned: true }).references(
    () => provinsiTable.id
  ),
  kabupaten_id: int("kabupaten_id", { unsigned: true }).references(
    () => kabupatenTable.id
  ),
  kecamatan_id: int("kecamatan_id", { unsigned: true }).references(
    () => kecamatanTable.id
  ),
  kelurahan_id: int("kelurahan_id", { unsigned: true }).references(
    () => kelurahanTable.id
  ),
  ...metaData,
});

export const membersTable = mysqlTable("members", {
  id: int("id", { unsigned: true }).autoincrement().primaryKey(),
  no_ktp: varchar("no_ktp", { length: 16 }).notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  no_hp: varchar("no_hp", { length: 15 }).notNull(),
  provinsi_id: int("provinsi_id", { unsigned: true })
    .notNull()
    .references(() => provinsiTable.id),
  kabupaten_id: int("kabupaten_id", { unsigned: true })
    .notNull()
    .references(() => kabupatenTable.id),
  kecamatan_id: int("kecamatan_id", { unsigned: true })
    .notNull()
    .references(() => kecamatanTable.id),
  kelurahan_id: int("kelurahan_id", { unsigned: true })
    .notNull()
    .references(() => kelurahanTable.id),
  ...metaData,
});
