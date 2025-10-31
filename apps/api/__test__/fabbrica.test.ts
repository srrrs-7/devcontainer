import {
  defineOrganizationFactory,
  defineClientFactory,
  defineUserFactory,
} from "@packages/db";
import { getPrisma } from "@packages/db";
import { describe, expect, it } from "vitest";

describe("Prisma Fabbrica", () => {

  it("should create an organization using factory", async () => {
    const OrganizationFactory = defineOrganizationFactory();
    const organization = await OrganizationFactory.create();

    expect(organization.id).toBeDefined();
    expect(organization.name).toBeDefined();
    expect(organization.createdAt).toBeInstanceOf(Date);
  });

  it("should create a client with organization using factory", async () => {
    const OrganizationFactory = defineOrganizationFactory();
    const ClientFactory = defineClientFactory({
      defaultData: {
        organization: OrganizationFactory,
      },
    });
    const client = await ClientFactory.create();

    expect(client.id).toBeDefined();
    expect(client.name).toBeDefined();
    expect(client.organizationId).toBeDefined();

    // Verify organization was created
    const prisma = getPrisma();
    const organization = await prisma.organization.findUnique({
      where: { id: client.organizationId },
    });
    expect(organization).toBeDefined();
  });

  it("should create a user with client and organization using factory", async () => {
    const OrganizationFactory = defineOrganizationFactory();
    const ClientFactory = defineClientFactory({
      defaultData: {
        organization: OrganizationFactory,
      },
    });
    const UserFactory = defineUserFactory({
      defaultData: {
        client: ClientFactory,
      },
    });
    const user = await UserFactory.create();

    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.clientId).toBeDefined();

    // Verify client and organization were created
    const prisma = getPrisma();
    const client = await prisma.client.findUnique({
      where: { id: user.clientId },
      include: { organization: true },
    });
    expect(client).toBeDefined();
    expect(client?.organization).toBeDefined();
  });

  it("should create with custom data", async () => {
    const OrganizationFactory = defineOrganizationFactory();
    const organization = await OrganizationFactory.create({
      name: "Custom Organization Name",
      description: "Custom Description",
    });

    expect(organization.name).toBe("Custom Organization Name");
    expect(organization.description).toBe("Custom Description");
  });
});
