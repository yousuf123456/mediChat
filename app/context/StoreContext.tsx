"use client"

import React, { ReactNode } from 'react'
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"

import messagesReducer from "../features/MessagesSlice"
import middleware from '@/middleware'

const store = configureStore({
    reducer : {
        messages : messagesReducer   
    },

    middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

interface StoreContextProps {
    children : ReactNode
}

export const StoreContext: React.FC<StoreContextProps> = ({ children }) => {
  return (
    <Provider store={store}>
        { children }
    </Provider>
  )
}
