import { useSelector } from "react-redux";
import { PawnInterface } from "../models";
import { RootState } from "../store";


const Hook = (id: number): PawnInterface[] => {
    const pawns: PawnInterface[] = useSelector(
        (state: RootState) => state.pawns.pawns
      );
    const pawnsToDisplay = pawns.filter((pawn) => pawn.position+1 === id);
    return pawnsToDisplay
}

export default Hook