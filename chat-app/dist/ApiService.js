// src/ApiService.ts
const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger/";
export class ApiService {
    static getToken() {
        return this.token;
    }
    static getUserId() {
        return this.userId;
    }
    // REGISTRIEREN
    static async registerUser(name, email, password, groupId) {
        // POST /registrieren.php with FormData or JSON
        try {
            const response = await fetch(`${BASE_URL}registrieren.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ name, email, password, group_id: groupId }),
            });
            const data = await response.json();
            if (data.success) {
                return { success: true, id: data.id };
            }
            return { success: false, error: "Register fail" };
        }
        catch (error) {
            console.error("API Error:", error);
            return { success: false, error: "API error" };
        }
    }
    // LOGIN
    static async loginUser(usernameOrEmail, password) {
        try {
            const response = await fetch(`${BASE_URL}login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username_or_email: usernameOrEmail, password }),
            });
            const data = await response.json();
            if (!data.token || !data.id) {
                console.error("Login failed - invalid response:", data);
                return { success: false, error: "Login failed" };
            }
            this.token = data.token;
            this.userId = data.id;
            return { success: true, token: data.token, id: data.id };
        }
        catch (error) {
            console.error("API Error:", error);
            return { success: false, error: "API error" };
        }
    }
    // Get Users
    static async getUsers() {
        try {
            const token = this.token;
            const id = this.userId;
            const response = await fetch(`${BASE_URL}get_users.php?token=${token}&id=${id}`);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("API Error:", error);
            return { error: "API error" };
        }
    }
    // Send Message
    static async sendMessage(senderId, receiverId, message) {
        try {
            const response = await fetch(`${BASE_URL}send_message.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ token: this.token, sender_id: senderId, receiver_id: receiverId, message }),
            });
            const data = await response.json();
            if (data.success) {
                return { success: true };
            }
            return { success: false, error: "Send failed" };
        }
        catch (error) {
            console.error("API Error:", error);
            return { success: false, error: "API error" };
        }
    }
    //get messages
    static async fetchMessages() {
        const response = await fetch(`${BASE_URL}get_messages.php`);
        return await response.json();
    }
}
ApiService.token = null;
ApiService.userId = null; // Optionally store user ID
