import { Card, CardContent } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { SquareInterface } from "../../models";
import { HouseInterface } from "../../models/HouseInterface";
import { RootState } from "../../store";
import { squareGroupColorMap } from "../board/SquareData";

type Props = {
  //   rent: number;
  //   mortgage: number;
  //   color: string;
};

const CaseCard = (props: Props) => {
  const selectedSquare: SquareInterface | null = useSelector(
    (state: RootState) => state.card.selectedSquare
  );
  const getClassName = (groupId: number | undefined) => {
    return groupId ? squareGroupColorMap.get(groupId) : "";
};

  const getCardContent = (selectedSquare: SquareInterface) => {
    return (
      <div className="wrapper">
        <div className="box">
          <h2 className={getClassName(selectedSquare.groupId)}>{selectedSquare.name}</h2>
          <p className="align-center">{selectedSquare.rent}</p>
          <div className="clear-both">
            {selectedSquare?.houses?.map((house: HouseInterface, index: number) => {
              return (
                getHouseContent(index, house.price)
              );
            })}
          </div>
          <p className="align-center clear-both">With HOTEL $1050</p>
          <small className="align-center">Morgage Value $110</small>
        </div>
      </div>
    );
  };

  const getHouseContent = (index: number, price: number) => {
      return (
        <>
            <div className="float-left">With {1 + index} House</div>
            <div className="float-right">${price}</div>
            <br />
        </>  
      )
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        {selectedSquare?.groupId ? (
          getCardContent(selectedSquare)
        ) : (
          <div>No card selected</div>
        )}
      </CardContent>
    </Card>
  );
};
export default CaseCard;
