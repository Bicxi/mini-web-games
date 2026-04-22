// src/ApiService.ts

export interface ApiResponse {
  success?: boolean;
  error?: string;
  token?: string;
  id?: string; // e.g. user ID after register or login
}

export interface User {
  id: string;
  name: string;
  group_id: string;
}

// Example chat message
export interface ChatMessage {
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp?: number; // if your API returns one
}

const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger/";

export class ApiService {
  private static token: string | null = null;
  private static userId: string | null = null;  // Optionally store user ID

  static getToken(): string | null {
    return this.token;
  }
  static getUserId(): string | null {
    return this.userId;
  }


  // REGISTRIEREN

  static async registerUser(
    name: string,
    email: string,
    password: string,
    groupId: string
  ): Promise<ApiResponse> {
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

    } catch (error) {
      console.error("API Error:", error);
      return { success: false, error: "API error" };
    }
  }


  // LOGIN

  static async loginUser(
    usernameOrEmail: string,
    password: string
  ): Promise<ApiResponse> {

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

    } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "API error" };
  }
}

  // Get Users
  static async getUsers(): Promise<User[] | { error?: string }> {
    try {
    const token = this.token;
    const id = this.userId;

    const response = await fetch(
      `${BASE_URL}get_users.php?token=${token}&id=${id}`
    );

    const data = await response.json();

    return data;

    } catch (error) {
      console.error("API Error:", error);
      return { error: "API error" };
    }
  }

  // Send Message
  static async sendMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}send_message.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: this.token!, sender_id: senderId, receiver_id: receiverId, message }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return { success: false, error: "Send failed" };

  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "API error" };
  }
}


  //get messages
  static async fetchMessages(): Promise<ChatMessage[]> {
    const response = await fetch(`${BASE_URL}get_messages.php`);
    return await response.json();
  }
}