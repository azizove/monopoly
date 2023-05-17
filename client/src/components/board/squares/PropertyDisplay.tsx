import React from "react";
import { SquareInterface } from "../../../models";
import { NyThemeData } from "../NyTheme";
import { ColorBar } from "./ColorBar";

interface Props {
    square: SquareInterface;
}


export const PropertyDisplay: React.FC<Props> = ({ square }) => {


    return (
        <React.Fragment>
            <ColorBar groupId={square.groupId || 0} />
            <div className="square-name">{square.name}</div>
        </React.Fragment>
    );

};