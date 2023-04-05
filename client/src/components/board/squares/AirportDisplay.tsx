import React from "react";
import { NyThemeData } from "../NyTheme";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlane } from '@fortawesome/free-solid-svg-icons'

interface Props {
    name: string;
}

export const AirportDisplay: React.FC<Props> = ({ name }) => {

    return (
        <React.Fragment>
            <div className="blank"></div>
            <div className="icon">
                {/* <FontAwesomeIcon icon={faPlane} size="3x" /> */}
            </div>
            <div className="square-name"> {name}</div>
        </React.Fragment>
    );

};