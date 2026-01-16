/**
 * Seed data for development environment
 */

export const organizationData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Development Organization",
  description: "Organization for development and testing",
};

export const clientData = {
  id: "00000000-0000-0000-0000-000000000001",
  organizationId: organizationData.id,
  name: "Development Client",
  contactPerson: "Dev User",
  email: "dev@example.com",
};

export const userData = {
  id: "dev-user-id",
  clientId: clientData.id,
  username: "dev-user",
  email: "dev@example.com",
  name: "Development User",
};
