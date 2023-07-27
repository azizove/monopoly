import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'
import { SquareInterface } from "../../../models";
import usePawnsToDisplay from "../../../hooks/pawnsToDisplay";
import PawnsGroup from "../../pawns/PawnsGroup";

interface Props {
    square: SquareInterface;
}

export const GoDisplay: React.FC<Props> = ({ square }) => {
    return (
        <React.Fragment>
            <div className="blank"></div>
            <div className="icon">
                {/* <FontAwesomeIcon icon={faHandPointLeft} color="green" /> */}
            </div>
            <div className="square-name"><PawnsGroup id={square.id} />GO</div>
        </React.Fragment>
    );

};