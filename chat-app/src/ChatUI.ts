// src/ChatUI.ts
import { User, ChatMessage } from "./ApiService.js"; // or from "types.ts"
import { ApiService } from "./ApiService.js";

export class ChatUI {
  constructor() {
    // Possibly attach event listeners or forms
  }

  async renderConversation(
    container: HTMLElement,
    currentUser: User,
    receiver: User
  ): Promise<void> {

    const messages: ChatMessage[] = await ApiService.getConversation(
      currentUser.id,
      receiver.id
    );

    console.log("Conversation:", messages);

    container.innerHTML = "";

    const header = document.getElementById("chat-header");
    if (header) {
      header.textContent = `Chat with ${receiver.name}`;
    }

    messages.forEach((msg) => {

      const div = document.createElement("div");
      div.classList.add("chat-message");

      if (msg.sender_id === currentUser.id) {
        div.classList.add("sent");
      } else {
        div.classList.add("received");
      }

      const raw = msg.timestamp;
      const rawStr = String(raw);

      let time = "";

      if (rawStr) {
        const d = new Date(rawStr.replace(" ", "T"));

        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");

        time = `${dd}.${mm} ${hh}:${min}`;
      }

      div.innerHTML = `
        <div>${msg.message}</div>
        <div class="timestamp">
          ${time}
        </div>
      `;

      container.appendChild(div);
    });
  }


  async showUsers(
    usersContainer: HTMLElement,
    currentUserId: string,
    onUserSelected: (user: User) => void
  ) {

    const users = await ApiService.getUsers();

    if (!Array.isArray(users)) return;

    usersContainer.innerHTML = "";

    users.forEach((user: User) => {

      const li = document.createElement("li");
      li.className = "person";
      li.textContent = user.name;

      li.addEventListener("click", () => {
        document.querySelectorAll(".person").forEach(el => {
          el.classList.remove("active");
        });

        li.classList.add("active");

        onUserSelected(user);
      });

      usersContainer.appendChild(li);
    });
  }

  static showBlock(block: string) {
    document.querySelectorAll(".block").forEach(b => { //setzte alle mit classe block auf display none
      (b as HTMLElement).style.display = "none";
    }); 

    const element = document.getElementById(block);
    if (element) {
      if (block === "dashboard-block") {
        element.style.display = "flex"; //setzt das richtige el auf display flex
      }
      else {
        element.style.display = "block"; //setzt das richtige el auf display block
      }
    }
  }

  static notShowButtons() {
    document.getElementById("buttons")!.style.display = "none";
  };

  // etc.
}