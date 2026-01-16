import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { clientData, organizationData, userData } from "./data/data";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DBNAME, DB_PORT } = process.env;
const connectionString = `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT ?? 5432}/${DB_DBNAME}?schema=public`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedOrganization() {
  const organization = await prisma.organization.upsert({
    where: { id: organizationData.id },
    update: {},
    create: organizationData,
  });
  console.log("Created organization:", organization.name);
  return organization;
}

async function seedClient() {
  const client = await prisma.client.upsert({
    where: { id: clientData.id },
    update: {},
    create: clientData,
  });
  console.log("Created client:", client.name);
  return client;
}

async function seedUser() {
  const user = await prisma.user.upsert({
    where: { id: userData.id },
    update: {},
    create: userData,
  });
  console.log("Created user:", user.username);
  return user;
}

async function main() {
  console.log("Seeding database...");

  await seedOrganization();
  await seedClient();
  await seedUser();

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
