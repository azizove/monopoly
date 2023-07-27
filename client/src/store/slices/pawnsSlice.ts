import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PawnInterface } from "../../models";
import pawnsData from "../../data/pawns.json";
interface InitialState {
  pawns: PawnInterface[];
}

interface PawnStepsInterface {
  id: number;
  steps: number;
}
const initialState: InitialState = {
    pawns: pawnsData,
};

export const pawnsSlice = createSlice({
  name: "pawns",
  initialState: initialState,
  reducers: {
    setPawnPosition: (state, action: PayloadAction<PawnStepsInterface>) => {
      state.pawns = state.pawns.map((pawn) => {
        if (pawn.id === action.payload.id) {
          return {
            ...pawn,
            position: action.payload.steps + pawn.position,
          };
        }
        return pawn;
      })
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPawnPosition } = pawnsSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default pawnsSlice.reducer;