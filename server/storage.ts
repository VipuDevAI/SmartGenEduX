import { 
  type User, type InsertUser,
  type Admin, type InsertAdmin,
  type School, type InsertSchool,
  type Subscription, type InsertSubscription,
  type Payment, type InsertPayment,
  type Document, type InsertDocument,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;
  
  getSchool(id: string): Promise<School | undefined>;
  getSchoolByEmail(email: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: string, updates: Partial<School>): Promise<School | undefined>;
  getAllSchools(): Promise<School[]>;
  
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionsBySchool(schoolId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  getAllSubscriptions(): Promise<Subscription[]>;
  
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsBySchool(schoolId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsBySchool(schoolId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  getAllDocuments(): Promise<Document[]>;
  
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private admins: Map<string, Admin>;
  private schools: Map<string, School>;
  private subscriptions: Map<string, Subscription>;
  private payments: Map<string, Payment>;
  private documents: Map<string, Document>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.admins = new Map();
    this.schools = new Map();
    this.subscriptions = new Map();
    this.payments = new Map();
    this.documents = new Map();
    this.auditLogs = new Map();
    
    this.initDefaultAdmin();
  }

  private async initDefaultAdmin() {
    const defaultAdmin: Admin = {
      id: randomUUID(),
      email: "admin@smartgenedux.com",
      password: "$2b$10$placeholder",
      name: "Super Admin",
      createdAt: new Date(),
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAdmin(id: string): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.email === email,
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { ...insertAdmin, id, createdAt: new Date() };
    this.admins.set(id, admin);
    return admin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  async getSchool(id: string): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async getSchoolByEmail(email: string): Promise<School | undefined> {
    return Array.from(this.schools.values()).find(
      (school) => school.email === email,
    );
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const id = randomUUID();
    const school: School = { 
      ...insertSchool, 
      id, 
      status: "pending", 
      createdAt: new Date(),
      gstNumber: insertSchool.gstNumber ?? null,
      tinNumber: insertSchool.tinNumber ?? null,
      panNumber: insertSchool.panNumber ?? null,
      registrationNumber: insertSchool.registrationNumber ?? null,
      studentCount: insertSchool.studentCount ?? 0,
    };
    this.schools.set(id, school);
    return school;
  }

  async updateSchool(id: string, updates: Partial<School>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) return undefined;
    const updated = { ...school, ...updates };
    this.schools.set(id, updated);
    return updated;
  }

  async getAllSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsBySchool(schoolId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.schoolId === schoolId,
    );
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      status: "pending", 
      approvedByAdmin: false, 
      approvedAt: null,
      createdAt: new Date(),
      contractYears: insertSubscription.contractYears ?? 1,
      trialEndDate: insertSubscription.trialEndDate ?? null,
      startDate: insertSubscription.startDate ?? null,
      endDate: insertSubscription.endDate ?? null,
      isTrialActive: insertSubscription.isTrialActive ?? false,
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    const updated = { ...subscription, ...updates };
    this.subscriptions.set(id, updated);
    return updated;
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsBySchool(schoolId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.schoolId === schoolId,
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      status: "pending", 
      paidAt: null,
      createdAt: new Date(),
      razorpayOrderId: insertPayment.razorpayOrderId ?? null,
      razorpayPaymentId: insertPayment.razorpayPaymentId ?? null,
      razorpaySignature: insertPayment.razorpaySignature ?? null,
      paymentMethod: insertPayment.paymentMethod ?? null,
      currency: insertPayment.currency ?? "INR",
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    const updated = { ...payment, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsBySchool(schoolId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.schoolId === schoolId,
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: new Date(),
      subscriptionId: insertDocument.subscriptionId ?? null,
    };
    this.documents.set(id, document);
    return document;
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = { 
      ...insertLog, 
      id, 
      createdAt: new Date(),
      performedBy: insertLog.performedBy ?? null,
      details: insertLog.details ?? null,
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
