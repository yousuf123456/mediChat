import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FullMessageType } from "../types";

interface MessagesState {
    messages: FullMessageType[]
}

const initialState: MessagesState = {
    messages : []
}

const messagesSlice = createSlice({
    name : "messages",
    initialState,
    reducers : {
        setMessages : (state, action : PayloadAction<FullMessageType[]>) => {
            state.messages = action.payload
        },

        addMessage : (state, action : PayloadAction<FullMessageType>) => {
        //    state.messages = [ ...state.messages, action.payload ] 
            state.messages = []
        },

        updateMessage : (state, action : PayloadAction<FullMessageType>) => {
            state.messages = state.messages.map((message) => { 
                if (message.id === action.payload.id) {
                    return action.payload
                }
                return message 
            })
        }
    }
});

export const { setMessages, addMessage, updateMessage } = messagesSlice.actions;
export default messagesSlice.reducer;