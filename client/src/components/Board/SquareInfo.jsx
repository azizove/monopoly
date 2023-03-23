import React from "react";
import { SquareConfigData } from "./SquareData";
import { SquareType } from "./SquareType";
import { AirportDisplay } from "./squares/AirportDisplay";
import { ChanceDisplay } from "./squares/ChanceDisplay";
import { PropertyDisplay } from "./squares/PropertyDisplay";
import { CentralParkDisplay } from "./squares/CentralParkDisplay";
import { GoDisplay } from "./squares/GoDisplay";
import { UtilityDisplay } from "./squares/UtilityDisplay";




export const SquareInfo = ({ square }) => {

    const name = square.name;
    const type = square.type;
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
            return <GoDisplay name={name} />
        }
        if (type === SquareType.Utility) {
            return <UtilityDisplay name={name} />
        }

        if (type === SquareType.Jail || type === SquareType.GoToJail) {
            return null;
        }

        return <PropertyDisplay id={square.id} name={name} />
    };


    return (
        getInfo()
    );

};