import React from "react";
import { SquareInterface } from "../../../models";
import { ColorBar } from "./ColorBar";
import PawnsGroup from "../../pawns/PawnsGroup";
interface Props {
    square: SquareInterface;
}


export const PropertyDisplay: React.FC<Props> = ({ square }) => {
    return (
        <React.Fragment>
            <ColorBar groupId={square.groupId || 0} />
            <div className="square-name">
                <PawnsGroup id={square.id} />
                {square.name}
            </div>
        </React.Fragment>
    );

};