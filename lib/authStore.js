import fs from 'fs/promises';
import path from 'path';
import { getDb } from '@/lib/mongodb';

const DATA_DIR = path.join(process.cwd(), 'memory');
const DATA_FILE = path.join(DATA_DIR, 'nexora-auth-store.json');

async function readStore() {
  try {
    const text = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return { users: [], sessions: [], uploads: [], payments: [], bugReports: [], serviceRequests: [] };
  }
}

async function writeStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export async function getAuthStore() {
  try {
    const db = await getDb();
    return {
      type: 'mongo',
      async findUser(query) {
        return db.collection('users').findOne(query);
      },
      async insertUser(user) {
        await db.collection('users').insertOne(user);
      },
      async updateUser(id, update) {
        await db.collection('users').updateOne({ id }, { $set: update });
        return db.collection('users').findOne({ id });
      },
      async insertSession(session) {
        await db.collection('sessions').insertOne(session);
      },
      async findSession(query) {
        return db.collection('sessions').findOne(query);
      },
      async insertUpload(upload) {
        await db.collection('uploads').insertOne(upload);
      },
      async findUpload(id) {
        return db.collection('uploads').findOne({ id });
      },
      async insertPayment(payment) {
        await db.collection('payments').insertOne(payment);
      },
      async updatePayment(id, update) {
        await db.collection('payments').updateOne({ id }, { $set: update });
        return db.collection('payments').findOne({ id });
      },
      async insertBugReport(report) {
        await db.collection('bug_reports').insertOne(report);
      },
      async listBugReports() {
        return db.collection('bug_reports').find({}).sort({ createdAt: -1 }).toArray();
      },
      async insertServiceRequest(serviceRequest) {
        await db.collection('service_requests').insertOne(serviceRequest);
      },
      async listServiceRequests() {
        return db.collection('service_requests').find({}).sort({ createdAt: -1 }).toArray();
      },
    };
  } catch {
    return {
      type: 'local-json',
      async findUser(query) {
        const store = await readStore();
        return store.users.find((user) => Object.entries(query).every(([key, value]) => {
          if (key === '$or') return value.some((entry) => Object.entries(entry).every(([k, v]) => user[k] === v));
          return user[key] === value;
        })) || null;
      },
      async insertUser(user) {
        const store = await readStore();
        store.users.unshift(user);
        await writeStore(store);
      },
      async updateUser(id, update) {
        const store = await readStore();
        store.users = store.users.map((user) => user.id === id ? { ...user, ...update } : user);
        await writeStore(store);
        return store.users.find((user) => user.id === id) || null;
      },
      async insertSession(session) {
        const store = await readStore();
        store.sessions.unshift(session);
        await writeStore(store);
      },
      async findSession(query) {
        const store = await readStore();
        return store.sessions.find((session) => Object.entries(query).every(([key, value]) => {
          if (value && typeof value === 'object' && '$exists' in value) return value.$exists ? key in session : !(key in session);
          return session[key] === value;
        })) || null;
      },
      async insertUpload(upload) {
        const store = await readStore();
        store.uploads.unshift(upload);
        await writeStore(store);
      },
      async findUpload(id) {
        const store = await readStore();
        return store.uploads.find((upload) => upload.id === id) || null;
      },
      async insertPayment(payment) {
        const store = await readStore();
        store.payments.unshift(payment);
        await writeStore(store);
      },
      async updatePayment(id, update) {
        const store = await readStore();
        store.payments = store.payments.map((payment) => payment.id === id ? { ...payment, ...update } : payment);
        await writeStore(store);
        return store.payments.find((payment) => payment.id === id) || null;
      },
      async insertBugReport(report) {
        const store = await readStore();
        store.bugReports = [report, ...(store.bugReports || [])];
        await writeStore(store);
      },
      async listBugReports() {
        const store = await readStore();
        return store.bugReports || [];
      },
      async insertServiceRequest(serviceRequest) {
        const store = await readStore();
        store.serviceRequests = [serviceRequest, ...(store.serviceRequests || [])];
        await writeStore(store);
      },
      async listServiceRequests() {
        const store = await readStore();
        return store.serviceRequests || [];
      },
    };
  }
}
