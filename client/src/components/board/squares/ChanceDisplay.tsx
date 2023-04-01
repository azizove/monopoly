import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'

interface Props {
    name: string;
}

export const ChanceDisplay: React.FC<Props> = ({ name }) => {

    return (
        <React.Fragment>
            <div className="blank"></div>
            <div className="icon">
                {/* <FontAwesomeIcon icon={faQuestion} size="3x" color="orange" /> */}
            </div>
            <div className="square-name"> CHANCE</div>
        </React.Fragment>
    );

};