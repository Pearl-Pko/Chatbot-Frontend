
export const Speaker = {
    AI: "AI",
    User: "USER",
};

export const MessageStatus = {
    SENT: "SENT", 
    PENDING: "PENDING",
    ERROR: "ERROR"
}

export class Chat {
    constructor(content, sender) {
        this.sender = sender;
        this.content = content;
        this.timestamp = new Date();
    }
}