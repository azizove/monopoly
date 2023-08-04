import { configureStore } from "@reduxjs/toolkit";
// This is how you import a reducer, based on the prior export.
import cardReducer from "./slices/cardSlice";
import pawnsReducer from "./slices/pawnsSlice";

const store = configureStore({
  reducer: {
    // You are free to call the LHS what you like, but it must have a reducer on the RHS.
    card: cardReducer,
    pawns: pawnsReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;