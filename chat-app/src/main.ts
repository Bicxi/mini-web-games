// src/main.ts

import { ApiService } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
import { StateManager } from "./StateManager.js"; // if you want

async function main() {
  console.log("MAIN RUNNING");

  // manage ui blocks
  document.getElementById("show-login-btn")?.addEventListener("click", () => {
    ChatUI.showBlock("login-block");
  });

  document.getElementById("show-register-btn")?.addEventListener("click", () => {
    ChatUI.showBlock("register-block");
  });

  // 1) Possibly register or login a user
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

    //Zum späteren nutzen - Statemanager wird nur am Anfang befüllt mit Daten aus Backend
    StateManager.setToken(res.token!);
    StateManager.setUserId(res.id!);

    console.log("User registered");
  });


  //AB HIER EINGELOOGED

  document.getElementById("login-btn")?.addEventListener("click", async () => {

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const res = await ApiService.loginUser(email, password);

    if (res.error) {
        console.error(res.error);
        return;
    }

    //Für später
    StateManager.setToken(res.token!);
    StateManager.setUserId(res.id!);

    console.log("Logged in");

    // 2) Fetch the user list
    const usersResp = await ApiService.getUsers();
    console.log("USERS:", usersResp);

    const list = document.getElementById("users-list");

    if (list && Array.isArray(usersResp)) {
      list.innerHTML = "";

      usersResp.forEach((user) => {
        const li = document.createElement("li");
        li.className = "person";
        li.textContent = `${user.name} (ID: ${user.id})`;
        list.appendChild(li);
      });

      ChatUI.showBlock("users-block");
      ChatUI.notShowButtons();
    }

    // 3) Send a message to a hardcoded user
    const sending = await ApiService.sendMessage(
      StateManager.getUserId()!, //sender
      "1574", //Bici3
      "Hello from TypeScript!"
    );    

    console.log("Message sent?", sending);

  });



  // 4) Render a chat UI
  const container = document.getElementById("chat-container");
  if (container) {
    const ui = new ChatUI();
    // For next week, you'd do something like:
    // ui.renderConversation(container, {id: "1", name: "Me", group_id: "1"}, {id: "2", name: "Bob", group_id: "1"});
  }
}

document.addEventListener("DOMContentLoaded", main);