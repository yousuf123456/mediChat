import { Conversation, Message, User } from "@prisma/client";


export type FullConversationType = Conversation & {
    messages: (Message & {
        seen: User[];
        sender: User;
    })[];
    users: User[];
}

export type FullMessageType = Message & {
    seen: User[];
    sender: User;
}