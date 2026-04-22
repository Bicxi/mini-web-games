export class ChatUI {
    constructor() {
        // Possibly attach event listeners or forms
    }
    async renderConversation(container, currentUser, receiver) {
        // 1) fetch the conversation from get_conversation.php (next week's feature)
        // 2) build HTML for each ChatMessage
        // 3) Insert into container
        // 4) style differently if msg.sender_id == currentUser.id
    }
    async showUsers(usersContainer) {
        // e.g. calls ApiService.getUsers() and lists them in a <ul>
    }
    static showBlock(block) {
        document.querySelectorAll(".block").forEach(b => {
            b.style.display = "none";
        });
        const element = document.getElementById(block);
        if (element)
            element.style.display = "block"; //setzt das richtige el auf display block
    }
    static notShowButtons() {
        document.getElementById("buttons").style.display = "none";
    }
    ;
}
