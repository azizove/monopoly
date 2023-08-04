import React from "react";
import usePawnsToDisplay from "../../hooks/pawnsToDisplay";
import { PawnInterface } from "../../models";
import Pawn from "./Pawn";

type Props = {
  id: number;
};

const PawnsGroup: React.FC<Props> = ({ id }) => {
  const pawnsToDisplay = usePawnsToDisplay(id);
  return (
    <>
      {pawnsToDisplay.map((pawn: PawnInterface) => (
        <Pawn key={pawn.id} color={pawn.color} />
      ))}
    </>
  );
};

export default PawnsGroup;
