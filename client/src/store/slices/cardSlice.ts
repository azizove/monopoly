import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SquareInterface } from "../../models";

interface InitialState {
  selectedSquare: SquareInterface | null;
}
const initialState: InitialState = {
    selectedSquare: null,
};

export const cardSlice = createSlice({
  name: "card",
  initialState: initialState,
  reducers: {
    setSquareInfo: (state, action: PayloadAction<SquareInterface | null>) => {
      state.selectedSquare = action.payload;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    // setcard: (state, action: PayloadAction<number>) => {
    //   state.value = action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { setSquareInfo } = cardSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default cardSlice.reducer;