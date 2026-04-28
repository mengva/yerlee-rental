// =========================================================
// ລະບົບຈັດການຫ້ອງແຖວ - Apartment Management System
// Drizzle ORM Schema — Updated to match your existing pattern
// =========================================================

import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  date,
  timestamp,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =========================================================
// ENUMS
// =========================================================

export const userRoleEnum = pgEnum("user_role", [
  "Staff",
  "RoomOwner",
  "Customer",
]);

export const membershipTypeEnum = pgEnum("membership_type", [
  "Regular",
  "VIP",
]);

export const imageTypeEnum = pgEnum("image_type", [
  "Profile",
  "Cover",
  "Room",
  "Document",
  "Contract",
]);

export const roomStatusEnum = pgEnum("room_status", [
  "Available",    // ຫວ່າງ
  "Reserved",     // ຈອງແລ້ວ
  "Rented",       // ເຊົ່າແລ້ວ
  "Maintenance",  // ສ້ອມແປງ
  "Unavailable",  // ບໍ່ພ້ອມ
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "Pending",    // ລໍຖ້າ
  "Confirmed",  // ຢືນຢັນແລ້ວ
  "Cancelled",  // ຍົກເລີກ
  "Converted",  // ປ່ຽນເປັນສັນຍາ
]);

export const contractStatusEnum = pgEnum("contract_status", [
  "Active",      // ກຳລັງໃຊ້
  "Expired",     // ໝົດອາຍຸ
  "Terminated",  // ຍົກເລີກກ່ອນກຳນົດ
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "BookingFee",   // ຄ່າຈອງ
  "Rent",         // ຄ່າເຊົ່າ
  "Deposit",      // ຄ່າມັດຈຳ
  "Utility",      // ຄ່ານໍ້າ-ໄຟ
  "Other",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "Paid",     // ຊຳລະແລ້ວ
  "Unpaid",   // ຍັງບໍ່ຊຳລະ
  "Partial",  // ຊຳລະບາງສ່ວນ
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "Cash",         // ເງິນສົດ
  "BankTransfer", // ໂອນເງິນ
  "QRCode",       // QR ໂຄດ
]);

// =========================================================
// 1. BASE USER TABLES (your existing pattern)
// =========================================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 150 }).notNull(),
  lastName: varchar("last_name", { length: 150 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  email: varchar("email", { length: 100 }).unique(),
  gender: varchar("gender", { length: 20 }),
  birthDay: varchar("birth_day", { length: 20 }),
  role: userRoleEnum("role").notNull().default("Customer"),
  isActive: boolean("is_active").default(true).notNull(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("users_phone_idx").on(table.phoneNumber),
  index("users_email_idx").on(table.email),
  index("users_role_idx").on(table.role),
  index("users_active_idx").on(table.isActive),
]);

export const userCredentials = pgTable("user_credentials", {
  userId: uuid("user_id").primaryKey().notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const images = pgTable("images", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  imageKey: text("image_key").notNull(),
  width: integer("width"),
  height: integer("height"),
  size: integer("size").notNull(),
  type: imageTypeEnum("type").default("Profile").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("images_user_id_idx").on(table.userId),
  index("images_room_id_idx").on(table.roomId),
  index("images_type_idx").on(table.type),
  index("images_is_primary_idx").on(table.isPrimary),
]);

// ==================== Role Extension Tables ====================

export const roomOwners = pgTable("room_owners", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 150 }),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("room_owners_company_idx").on(table.companyName),
]);

export const staffs = pgTable("staffs", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  salary: numeric("salary", { precision: 10, scale: 2 }),
  position: varchar("position", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});

export const customers = pgTable("customers", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  membershipType: membershipTypeEnum("membership_type").default("Regular"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("customers_membership_idx").on(table.membershipType),
]);

// =========================================================
// 2. ROOM TABLES
// =========================================================

export const roomTypes = pgTable("room_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  typeName: varchar("type_name", { length: 100 }).notNull(),
  description: text("description"),
  baseRentPrice: numeric("base_rent_price", { precision: 12, scale: 2 }).notNull(),
  depositMonths: integer("deposit_months").default(2),  // ຄ່າມັດຈຳ = N ເດືອນ
  maxOccupants: integer("max_occupants").default(1),
  areaSqm: numeric("area_sqm", { precision: 6, scale: 2 }),
  amenities: text("amenities"),  // JSON string of features
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("room_types_name_idx").on(table.typeName),
  index("room_types_active_idx").on(table.isActive),
]);

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  roomTypeId: uuid("room_type_id").references(() => roomTypes.id, { onDelete: "cascade" }).notNull(),
  roomNumber: varchar("room_number", { length: 20 }).notNull().unique(),
  floor: integer("floor"),
  rentPrice: numeric("rent_price", { precision: 12, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 }),
  status: roomStatusEnum("status").default("Available").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("rooms_owner_idx").on(table.ownerUserId),
  index("rooms_type_idx").on(table.roomTypeId),
  index("rooms_status_idx").on(table.status),
  index("rooms_active_idx").on(table.isActive),
]);

// =========================================================
// 3. SERVICES
// =========================================================

// ຈອງຫ້ອງ - Booking
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingCode: varchar("booking_code", { length: 30 }).notNull().unique(),
  cancelledById: uuid("cancelled_by_id").references(() => users.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  bookingDate: date("booking_date").notNull(),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").default("Pending").notNull(),
  cancelReason: text("cancel_reason"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("bookings_customer_idx").on(table.customerId),
  index("bookings_staff_idx").on(table.staffId),
  index("bookings_cancelled_by_id_idx").on(table.cancelledById),
  index("bookings_room_idx").on(table.roomId),
  index("bookings_status_idx").on(table.status),
]);

// ສັນຍາເຊົ່າ - Rental Contract
export const contracts = pgTable("contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractCode: varchar("contract_code", { length: 30 }).notNull().unique(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  rentPrice: numeric("rent_price", { precision: 12, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 }),
  depositPaid: boolean("deposit_paid").default(false).notNull(),
  numberOfOccupants: integer("number_of_occupants").default(1),
  status: contractStatusEnum("status").default("Active").notNull(),
  terms: text("terms"),
  witnessName: varchar("witness_name", { length: 150 }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("contracts_customer_idx").on(table.customerId),
  index("contracts_staff_idx").on(table.staffId),
  index("contracts_booking_idx").on(table.bookingId),
  index("contracts_room_idx").on(table.roomId),
  index("contracts_status_idx").on(table.status),
]);

// ແຈ້ງເຂົ້າ - Check-In
export const checkIns = pgTable("check_ins", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  checkInDate: timestamp("check_in_date", { withTimezone: true }).defaultNow().notNull(),
  roomConditionNote: text("room_condition_note"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("check_ins_contract_idx").on(table.contractId),
  index("check_ins_room_idx").on(table.roomId),
  index("check_ins_staff_idx").on(table.staffId),
]);

// ແຈ້ງອອກ - Check-Out
export const checkOuts = pgTable("check_outs", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  checkOutDate: timestamp("check_out_date", { withTimezone: true }).defaultNow().notNull(),
  roomConditionNote: text("room_condition_note"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("check_outs_contract_idx").on(table.contractId),
  index("check_outs_room_idx").on(table.roomId),
  index("check_outs_staff_idx").on(table.staffId),
]);

// ປ່ຽນຫ້ອງ - Room Transfer
export const roomTransfers = pgTable("room_transfers", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  fromRoomId: uuid("from_room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  toRoomId: uuid("to_room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  transferDate: date("transfer_date").defaultNow().notNull(),
  reason: text("reason"),
  priceDifference: numeric("price_difference", { precision: 12, scale: 2 }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("room_transfers_contract_idx").on(table.contractId),
  index("room_transfers_staff_idx").on(table.staffId),
]);

// =========================================================
// 4. PAYMENTS
// =========================================================

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentCode: varchar("payment_code", { length: 30 }).notNull().unique(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "cascade" }).notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  paymentType: paymentTypeEnum("payment_type").notNull(),
  paymentDate: date("payment_date").defaultNow().notNull(),
  dueDate: date("due_date"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default("0"),
  paymentStatus: paymentStatusEnum("payment_status").default("Unpaid").notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  referenceNumber: varchar("reference_number", { length: 100 }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("payments_customer_idx").on(table.customerId),
  index("payments_staff_idx").on(table.staffId),
  index("payments_contract_idx").on(table.contractId),
  index("payments_type_idx").on(table.paymentType),
  index("payments_status_idx").on(table.paymentStatus),
  index("payments_due_date_idx").on(table.dueDate),
]);

// ຄ່ານໍ້າ-ໄຟຟ້າ - Utility Bill
export const utilityBills = pgTable("utility_bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  billCode: varchar("bill_code", { length: 30 }).notNull().unique(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  staffId: uuid("staff_id").references(() => users.id, { onDelete: "set null" }),
  paymentId: uuid("payment_id").references(() => payments.id, { onDelete: "set null" }),
  billingMonth: varchar("billing_month", { length: 7 }).notNull(), // "2025-01"
  // ໄຟຟ້າ
  electricityPrevMeter: numeric("electricity_prev_meter", { precision: 10, scale: 2 }),
  electricityCurrentMeter: numeric("electricity_current_meter", { precision: 10, scale: 2 }),
  electricityUnitsUsed: numeric("electricity_units_used", { precision: 10, scale: 2 }),
  electricityRate: numeric("electricity_rate", { precision: 8, scale: 2 }),
  electricityAmount: numeric("electricity_amount", { precision: 12, scale: 2 }),
  // ນໍ້າ
  waterPrevMeter: numeric("water_prev_meter", { precision: 10, scale: 2 }),
  waterCurrentMeter: numeric("water_current_meter", { precision: 10, scale: 2 }),
  waterUnitsUsed: numeric("water_units_used", { precision: 10, scale: 2 }),
  waterRate: numeric("water_rate", { precision: 8, scale: 2 }),
  waterAmount: numeric("water_amount", { precision: 12, scale: 2 }),
  // ລວມ
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: date("due_date"),
  paymentStatus: paymentStatusEnum("payment_status").default("Unpaid").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
  index("utility_bills_contract_idx").on(table.contractId),
  index("utility_bills_room_idx").on(table.roomId),
  index("utility_bills_month_idx").on(table.billingMonth),
  index("utility_bills_status_idx").on(table.paymentStatus),
  // ໜຶ່ງຫ້ອງ ໜຶ່ງເດືອນ ມີໃບບິນດຽວ
  unique("utility_bills_contract_month_unique").on(table.contractId, table.billingMonth),
]);

// =========================================================
// RELATIONS
// =========================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  credentials: one(userCredentials, { fields: [users.id], references: [userCredentials.userId] }),
  images: many(images),
  roomOwner: one(roomOwners, { fields: [users.id], references: [roomOwners.userId] }),
  staff: one(staffs, { fields: [users.id], references: [staffs.userId] }),
  customer: one(customers, { fields: [users.id], references: [customers.userId] }),
  ownedRooms: many(rooms, { relationName: "roomOwner" }),
  bookingsAsCustomers: many(bookings, { relationName: "bookingCustomers" }),
  bookingsAsStaffs: many(bookings, { relationName: "bookingStaffs" }),
  contractsAsCustomers: many(contracts, { relationName: "contractCustomers" }),
  contractsAsStaffs: many(contracts, { relationName: "contractStaffs" }),
  paymentsAsCustomers: many(payments, { relationName: "paymentCustomers" }),
  paymentsAsStaffs: many(payments, { relationName: "paymentStaffs" }),
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
  user: one(users, {
    fields: [userCredentials.userId],
    references: [users.id],
  }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [images.roomId],
    references: [rooms.id],
  }),
}));

export const roomOwnerRelations = relations(roomOwners, ({ one, many }) => ({
  user: one(users, {
    fields: [roomOwners.userId],
    references: [users.id],
  }),
}));

export const staffRelations = relations(staffs, ({ one }) => ({
  user: one(users, {
    fields: [staffs.userId],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  owner: one(users, { fields: [rooms.ownerUserId], references: [users.id], relationName: "roomOwner" }),
  roomType: one(roomTypes, { fields: [rooms.roomTypeId], references: [roomTypes.id] }),
  images: many(images),
  bookings: many(bookings),
  contracts: many(contracts),
  checkIns: many(checkIns),
  checkOuts: many(checkOuts),
  payments: many(payments),
  utilityBills: many(utilityBills),
  transfersFrom: many(roomTransfers, { relationName: "transferFrom" }),
  transfersTo: many(roomTransfers, { relationName: "transferTo" }),
}));

export const roomTypesRelations = relations(roomTypes, ({ many }) => ({
  rooms: many(rooms),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, { fields: [bookings.customerId], references: [users.id], relationName: "bookingCustomer" }),
  staff: one(users, { fields: [bookings.staffId], references: [users.id], relationName: "bookingStaff" }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
  contracts: many(contracts),
  payments: many(payments),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  booking: one(bookings, { fields: [contracts.bookingId], references: [bookings.id] }),
  customer: one(users, { fields: [contracts.customerId], references: [users.id], relationName: "contractCustomer" }),
  staff: one(users, { fields: [contracts.staffId], references: [users.id], relationName: "contractStaff" }),
  room: one(rooms, { fields: [contracts.roomId], references: [rooms.id] }),
  checkIns: many(checkIns),
  checkOuts: many(checkOuts),
  payments: many(payments),
  utilityBills: many(utilityBills),
  roomTransfers: many(roomTransfers),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  contract: one(contracts, { fields: [checkIns.contractId], references: [contracts.id] }),
  customer: one(users, { fields: [checkIns.customerId], references: [users.id] }),
  staff: one(users, { fields: [checkIns.staffId], references: [users.id] }),
  room: one(rooms, { fields: [checkIns.roomId], references: [rooms.id] }),
}));

export const checkOutsRelations = relations(checkOuts, ({ one }) => ({
  contract: one(contracts, { fields: [checkOuts.contractId], references: [contracts.id] }),
  customer: one(users, { fields: [checkOuts.customerId], references: [users.id] }),
  staff: one(users, { fields: [checkOuts.staffId], references: [users.id] }),
  room: one(rooms, { fields: [checkOuts.roomId], references: [rooms.id] }),
}));

export const roomTransfersRelations = relations(roomTransfers, ({ one }) => ({
  contract: one(contracts, { fields: [roomTransfers.contractId], references: [contracts.id] }),
  customer: one(users, { fields: [roomTransfers.customerId], references: [users.id] }),
  fromRoom: one(rooms, { fields: [roomTransfers.fromRoomId], references: [rooms.id], relationName: "transferFrom" }),
  toRoom: one(rooms, { fields: [roomTransfers.toRoomId], references: [rooms.id], relationName: "transferTo" }),
  staff: one(users, { fields: [roomTransfers.staffId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  contract: one(contracts, { fields: [payments.contractId], references: [contracts.id] }),
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
  customer: one(users, { fields: [payments.customerId], references: [users.id], relationName: "paymentCustomer" }),
  staff: one(users, { fields: [payments.staffId], references: [users.id], relationName: "paymentStaff" }),
  room: one(rooms, { fields: [payments.roomId], references: [rooms.id] }),
  utilityBills: many(utilityBills),
}));

export const utilityBillsRelations = relations(utilityBills, ({ one }) => ({
  contract: one(contracts, { fields: [utilityBills.contractId], references: [contracts.id] }),
  customer: one(users, { fields: [utilityBills.customerId], references: [users.id] }),
  room: one(rooms, { fields: [utilityBills.roomId], references: [rooms.id] }),
  staff: one(users, { fields: [utilityBills.staffId], references: [users.id] }),
  payment: one(payments, { fields: [utilityBills.paymentId], references: [payments.id] }),
}));

// =========================================================
// TYPE EXPORTS
// =========================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type RoomOwner = typeof roomOwners.$inferSelect;
export type NewRoomOwner = typeof roomOwners.$inferInsert;
export type Staff = typeof staffs.$inferSelect;
export type NewStaff = typeof staffs.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type RoomType = typeof roomTypes.$inferSelect;
export type NewRoomType = typeof roomTypes.$inferInsert;
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type CheckIn = typeof checkIns.$inferSelect;
export type NewCheckIn = typeof checkIns.$inferInsert;
export type CheckOut = typeof checkOuts.$inferSelect;
export type NewCheckOut = typeof checkOuts.$inferInsert;
export type RoomTransfer = typeof roomTransfers.$inferSelect;
export type NewRoomTransfer = typeof roomTransfers.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type UtilityBill = typeof utilityBills.$inferSelect;
export type NewUtilityBill = typeof utilityBills.$inferInsert;