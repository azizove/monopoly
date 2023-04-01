import React from "react";
import { BoardSection, SquareType } from "../../models";
import boardData from "../../data/board.json";
import { SquareInfo } from "./SquareInfo";

interface Props {
  id: number;
}

export const GameSquare: React.FC<Props> = ({ id }) => {
  const section: BoardSection = boardData[id]?.section!;
  const squareType: SquareType = boardData[id]?.type!;

  const sectionMap = new Map<BoardSection, string>([
    [BoardSection.Top, "top"], [BoardSection.Right, "right"], [BoardSection.Left, "left"], [BoardSection.Bottom, "bottom"]
  ]);

  const squareTypeClass = new Map<SquareType, string>([
    [SquareType.Airport, "airport"], [SquareType.Chance, "chance"], [SquareType.Go, "passgo"],
    [SquareType.GoToJail, "go-to-jail"], [SquareType.Jail, "jail"], [SquareType.Property, "property"],
    [SquareType.CentralPark, "central-park"], [SquareType.Utility, "utility"]
  ]);

  const getContainerClassName = () => {
    return "container container-" + sectionMap.get(section);
  };

  const getSquareClassName = () => {
    return "square " + squareTypeClass.get(squareType);
  };

  const getSquareId = () => {
    return "game-square-" + id;
  };


  return (
    <div className={getSquareClassName()} id={getSquareId()}>
      <div className={getContainerClassName()}>
        <SquareInfo square={boardData[id]} />
      </div>
    </div>
  );

};
