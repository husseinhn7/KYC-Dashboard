 import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import  UserModel  from './models/user.model';
import  KYCVerificationModel  from './models/kyc.model';
import  TransactionModel  from './models/transaction.model';
import  AuditLogModel  from './models/audit.model';
import { faker } from "@faker-js/faker";

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://7ussein2510:7ussein2510@cluster0.xwbvek3.mongodb.net/kyc';



export enum Region {
  MENA = "MENA", // Middle East and North Africa
  EU = "EU", // European Union
  NA = "NA", // North America
  SA = "SA", // South America
  APAC = "APAC", // Asia-Pacific
  SSA = "SSA", // Sub-Saharan Africa
  GLOBAL = "GLOBAL", // For global admin or non-region-specific cases
}
const PASSWORD = "password123";
const SALT_ROUNDS = 10;

/** Utility to choose a random item from an array */
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("📦  Connected to MongoDB");

  // 1️⃣ Clean slate
  await Promise.all([
    UserModel.deleteMany({}),
    KYCVerificationModel.deleteMany({}),
    TransactionModel.deleteMany({}),
    AuditLogModel.deleteMany({}),
  ]);
  console.log("🧹  Collections cleared");

  // 2️⃣ Password hash
  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  // 3️⃣ Core role users
  const [admin, regional, senderPartner, receiverPartner] =
    await UserModel.insertMany([
      {
        name: "Global Admin",
        email: "admin@kyc.com",
        password: hash,
        role: "global_admin",
        region: Region.GLOBAL,
      },
      {
        name: "Regional Admin",
        email: "regional@kyc.com",
        password: hash,
        role: "regional_admin",
        region: Region.MENA,
      },
      {
        name: "Sender Partner",
        email: "sender@kyc.com",
        password: hash,
        role: "sending_partner",
        region: Region.MENA,
      },
      {
        name: "Receiver Partner",
        email: "receiver@kyc.com",
        password: hash,
        role: "receiving_partner",
        region: Region.EU,
      },
    ]);
  console.log("✅  Inserted core users");

  // 4️⃣ Fifty real‑name customers
  const extraUsersData = Array.from({ length: 50 }).map(() => {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    return {
      name: `${first} ${last}`,
      email: faker.internet
        .email({ firstName: first, lastName: last })
        .toLowerCase(),
      password: hash,
      phone : faker.phone.number(),
      role: "sending_partner", // ordinary customers need no partner role – keep simple
      region: pick([
        Region.MENA,
        Region.EU,
        Region.NA,
        Region.SA,
        Region.APAC,
        Region.SSA,
      ]),
    };
  });
  const customers = await UserModel.insertMany(extraUsersData);
  console.log("👥  Inserted 50 customers");

  // Helper: pick random user
  const randomUser = () => pick(customers);

  // 5️⃣ 60 KYC cases
  const kycCases = Array.from({ length: 60 }).map(() => {
    const customer = randomUser();
    const caseId = (customer._id as string ).toString();
    const status = pick(["pending", "approved", "rejected"] as const);
    return {
      user: customer._id,
      status,
      region: customer.region,
      documents: {
        id_front: `/static/idFront.jpg`,
        id_back: `/static/idBack.jpg`,
        proof_of_address: `/static/add.jpg`,
      },
      reason: status === "rejected" ? "Document mismatch" : "",
      notes: [],
    };
  });
  const insertedKycCases = await KYCVerificationModel.insertMany(kycCases);
  console.log("📑  Inserted 60 KYC cases");

  // 6️⃣ 100 transactions
  const transactions = Array.from({ length: 100 }).map(() => {
    let sender = randomUser();
    let receiver = randomUser();
    // ensure distinct parties
    while ((receiver._id as string) === (sender._id as string)) receiver = randomUser();

    return {
      sender: sender._id,
      receiver: receiver._id,
      amount: faker.number.float({ min: 10, max: 5000, fractionDigits: 2 }),
      currency: pick(["USD", "USDC"] as const),
      status: pick(["completed", "pending", "failed"] as const),
      region: sender.region,
      timestamp: faker.date.recent({ days: 30 }),
    };
  });
  await TransactionModel.insertMany(transactions);
  console.log("💸  Inserted 100 transactions");

  // 7️⃣ 40 audit logs (simulate KYC approvals/rejections)
  const auditLogs = Array.from({ length: 40 }).map((_, i) => {
    const caseDoc = pick(insertedKycCases);
    const actor = i % 2 === 0 ? admin : regional; // alternate between admins
    return {
      user: actor._id,
      action: `${actor.name} ${
        caseDoc.status === "approved" ? "approved" : "reviewed"
      } KYC case ${caseDoc._id}`,
      region: caseDoc.region,
      status: "success",
      timestamp: faker.date.recent({ days: 30 }),
      details: caseDoc.status === "rejected" ? "Additional docs required" : "",
    };
  });
  await AuditLogModel.insertMany(auditLogs);
  console.log("🧾  Inserted 40 audit logs");

  console.log("🌱  Database seeding complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seeding error:", err);
  process.exit(1);
});
