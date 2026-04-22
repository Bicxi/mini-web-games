// src/StateManager.ts

export class StateManager {
  private static token: string | null = null;
  private static userId: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
  }
  static getToken(): string | null {
    return this.token;
  }

  static setUserId(uid: string | null) {
    this.userId = uid;
  }
  static getUserId(): string | null {
    return this.userId;
  }
}