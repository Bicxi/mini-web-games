// src/main.ts

import { ApiService, User } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
import { StateManager } from "./StateManager.js";

async function main() {
  console.log("MAIN RUNNING");

  let selectedUser: User | null = null;
  let chatInterval: any = null;

  // manage ui blocks
  document.getElementById("show-login-btn")?.addEventListener("click", () => {
    ChatUI.showBlock("login-block");
  });

  document.getElementById("show-register-btn")?.addEventListener("click", () => {
    ChatUI.showBlock("register-block");
  });

  // REGISTER
  document.getElementById("register-btn")?.addEventListener("click", async () => {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("emailReg") as HTMLInputElement).value;
    const password = (document.getElementById("passwordReg") as HTMLInputElement).value;
    const groupId = (document.getElementById("group") as HTMLInputElement).value;

    const res = await ApiService.registerUser(name, email, password, groupId);

    if (!res.success) {
      console.error("Register failed");
      return;
    }

    StateManager.setToken(res.token!);
    StateManager.setUserId(res.id!);

    console.log("User registered");
  });

  // LOGIN
  document.getElementById("login-btn")?.addEventListener("click", async () => {

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const res = await ApiService.loginUser(email, password);

    if (res.error) {
      console.error(res.error);
      return;
    }

    StateManager.setToken(res.token!);
    StateManager.setUserId(res.id!);

    console.log("Logged in");

    const list = document.getElementById("users-list");

    if (list) {
      const ui = new ChatUI();

      await ui.showUsers(
        list,
        StateManager.getUserId()!,
        async (user: User) => {

          selectedUser = user;

          if (chatInterval) clearInterval(chatInterval); //altes intervall löschen, damit nicht mehrere gleichzeitig laufen

          const container = document.getElementById("chat-messages");
          if (!container) return;

          const ui = new ChatUI();

          // 1: sofort laden
          await ui.renderConversation(
            container,
            {
              id: StateManager.getUserId()!,
              name: "Me",
              group_id: "1"
            },
            selectedUser
          );

          // 2: interval starten
          chatInterval = setInterval(async () => {

            if (!selectedUser) return;

            const container = document.getElementById("chat-messages");
            if (!container) return;

            const ui = new ChatUI();

            await ui.renderConversation(
              container,
              {
                id: StateManager.getUserId()!,
                name: "Me",
                group_id: "1"
              },
              selectedUser
            );

          }, 15000);
        }
      );
    }

    ChatUI.notShowButtons();
    ChatUI.showBlock("dashboard-block");
  });

  // SEND MESSAGE
  document.getElementById("chat-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      console.error("No user selected");
      return;
    }

    const input = document.getElementById("chat-input") as HTMLInputElement;
    const message = input.value.trim();
    if (!message) return;

    const sending = await ApiService.sendMessage(
      StateManager.getUserId()!,
      selectedUser.id,
      message
    );

    console.log("Message sent?", sending);

    input.value = "";

    const container = document.getElementById("chat-messages");

    if (container) {
      const ui = new ChatUI();

      await ui.renderConversation(
        container,
        {
          id: StateManager.getUserId()!,
          name: "Me",
          group_id: "1"
        },
        selectedUser
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", main);