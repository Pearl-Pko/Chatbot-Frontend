
export const Speaker = {
    AI: "AI",
    User: "USER",
};

export class Chat {
    constructor(message, speaker) {
        this.speaker = speaker;
        this.message = message;
        this.timestamp = new Date();
    }
}