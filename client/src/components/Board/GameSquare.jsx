import React from "react";
import { BoardSection } from "./BoardSection";
import { SquareConfigData } from "./SquareData";
import { SquareInfo } from "./SquareInfo";
import { SquareType } from "./SquareType";
import boardData from "../../data/board.json";


export const GameSquare = ({ id }) => {

  const section = boardData[id]?.section;
  const squareType = boardData[id]?.type;

  const sectionMap = new Map([
    [BoardSection.Top, "top"], [BoardSection.Right, "right"], [BoardSection.Left, "left"], [BoardSection.Bottom, "bottom"]
  ]);

  const squareTypeClass = new Map([
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