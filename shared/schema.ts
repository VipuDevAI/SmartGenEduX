import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  principalName: text("principal_name").notNull(),
  gstNumber: text("gst_number"),
  tinNumber: text("tin_number"),
  panNumber: text("pan_number"),
  registrationNumber: text("registration_number"),
  studentCount: integer("student_count").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true, createdAt: true, status: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  productType: text("product_type").notNull(),
  pricePerStudent: integer("price_per_student").notNull(),
  studentCount: integer("student_count").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  isTrialActive: boolean("is_trial_active").notNull().default(false),
  trialEndDate: timestamp("trial_end_date"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  contractYears: integer("contract_years").notNull().default(1),
  approvedByAdmin: boolean("approved_by_admin").notNull().default(false),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ 
  id: true, createdAt: true, status: true, approvedByAdmin: true, approvedAt: true 
});
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  subscriptionId: varchar("subscription_id").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ 
  id: true, createdAt: true, status: true, paidAt: true 
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  subscriptionId: varchar("subscription_id"),
  type: text("type").notNull(),
  documentNumber: text("document_number").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  performedBy: varchar("performed_by"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export const productPricing = {
  "parikshanai-questionbank": { name: "ParikshanAI + Question Bank", price: 10, unit: "per student/month" },
  "school-safal": { name: "School SAFAL", price: 2, unit: "per student" },
  "siteforgeai": { name: "SiteForgeAI", price: 0, unit: "coming soon" },
  "patashala-erp": { name: "Patashala ERP", price: 0, unit: "coming soon" },
  "connecto": { name: "Connecto", price: 0, unit: "coming soon" },
};
