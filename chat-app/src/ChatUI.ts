// src/ChatUI.ts
import { User, ChatMessage } from "./ApiService"; // or from "types.ts"
import { ApiService } from "./ApiService";

export class ChatUI {
  constructor() {
    // Possibly attach event listeners or forms
  }

  async renderConversation(
    container: HTMLElement,
    currentUser: User,
    receiver: User
  ): Promise<void> {
    // 1) fetch the conversation from get_conversation.php (next week's feature)
    // 2) build HTML for each ChatMessage
    // 3) Insert into container
    // 4) style differently if msg.sender_id == currentUser.id
  }

  async showUsers(usersContainer: HTMLElement) {
    // e.g. calls ApiService.getUsers() and lists them in a <ul>
  }

  static showBlock(block: string) {
    document.querySelectorAll(".block").forEach(b => { //setzte alle mit classe block auf display none
      (b as HTMLElement).style.display = "none";
    }); 

    const element = document.getElementById(block);
    if (element) element.style.display = "block"; //setzt das richtige el auf display block
  }

  static notShowButtons() {
    document.getElementById("buttons")!.style.display = "none";
  };

  // etc.
}