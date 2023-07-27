import React from "react";
import { AirportDisplay } from "./squares/AirportDisplay";
import { ChanceDisplay } from "./squares/ChanceDisplay";
import { PropertyDisplay } from "./squares/PropertyDisplay";
import { CentralParkDisplay } from "./squares/CentralParkDisplay";
import { GoDisplay } from "./squares/GoDisplay";
import { UtilityDisplay } from "./squares/UtilityDisplay";
import { SquareInterface, SquareType } from "../../models";

interface Props {
    square: SquareInterface;
}

export const SquareInfo: React.FC<Props> = ({ square }) => {

    const {name, type} = square;

    const getInfo = () => {
        if (type === SquareType.Airport) {
            return <AirportDisplay name={name} />
        }
        if (type === SquareType.Chance) {
            return <ChanceDisplay name={name} />
        }
        if (type === SquareType.CentralPark) {
            return <CentralParkDisplay name={name} />
        }
        if (type === SquareType.Go) {
            return <GoDisplay square={square} />
        }
        if (type === SquareType.Utility) {
            return <UtilityDisplay name={name} />
        }

        if (type === SquareType.Jail || type === SquareType.GoToJail) {
            return null;
        }

        return <PropertyDisplay square={square} />
    };


    return (
        getInfo()
    );

};