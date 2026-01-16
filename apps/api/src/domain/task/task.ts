export class Task {
  constructor(
    private userId: string,
    private taskId: string,
    private content: string,
    private completedAt: Date | null,
    private version: number,
    private createdAt: Date,
    private updatedAt: Date,
  ) {
    this.userId = userId;
    this.taskId = taskId;
    this.content = content;
    this.completedAt = completedAt;
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  getTaskId(): string {
    return this.taskId;
  }

  getContent(): string {
    return this.content;
  }

  getCompletedAt(): Date | null {
    return this.completedAt;
  }

  getVersion(): number {
    return this.version;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
