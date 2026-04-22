// src/StateManager.ts
export class StateManager {
    static setToken(token) {
        this.token = token;
    }
    static getToken() {
        return this.token;
    }
    static setUserId(uid) {
        this.userId = uid;
    }
    static getUserId() {
        return this.userId;
    }
}
StateManager.token = null;
StateManager.userId = null;
