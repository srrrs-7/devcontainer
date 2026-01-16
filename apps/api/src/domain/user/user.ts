export class User {
  constructor(
    private readonly userId: string,
    private readonly clientId: string,
    private readonly username: string,
    private readonly email: string,
    private readonly name: string | null,
    private readonly picture: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.userId = userId;
    this.clientId = clientId;
    this.username = username;
    this.email = email;
    this.name = name;
    this.picture = picture;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string | null {
    return this.name;
  }

  public getPicture(): string | null {
    return this.picture;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
