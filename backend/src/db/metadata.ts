import { timestamp, varchar } from "drizzle-orm/mysql-core";

export const metaData = {
  createdAt: timestamp("created_at", { mode: "date", fsp: 0 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", fsp: 0 })
    .notNull()
    .defaultNow()
    .onUpdateNow(),
  deletedAt: timestamp("deleted_at", { mode: "date", fsp: 0 }),
  createdBy: varchar("created_by", { length: 255 }), // email of creator
  updatedBy: varchar("updated_by", { length: 255 }), // email of last updater
  deletedBy: varchar("deleted_by", { length: 255 }), // email of who deleted
};
