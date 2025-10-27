export type User = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  clientId: string;
  username: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserInput = {
  userId: string;
  username?: string;
  email?: string;
  passwordHash?: string;
};

export type DeleteUserInput = {
  userId: string;
};

export type GetUserInput = {
  userId: string;
};

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByUsernameInput = {
  username: string;
};

export type ListUsersInput = {
  clientId: string;
  page?: number;
  limit?: number;
};
