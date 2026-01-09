export type User = {
  userId: string; // Cognito sub
  clientId: string;
  username: string;
  email: string;
  name: string | null;
  picture: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  userId: string; // Required: Cognito sub
  clientId: string;
  username: string;
  email: string;
  name?: string;
  picture?: string;
};

export type UpdateUserInput = {
  userId: string;
  username?: string;
  email?: string;
  name?: string;
  picture?: string;
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
