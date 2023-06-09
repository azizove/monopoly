import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'

interface Props {
    name: string;
}

export const GoDisplay: React.FC<Props> = ({ name }) => {

    return (
        <React.Fragment>
            <div className="blank"></div>
            <div className="icon">
                {/* <FontAwesomeIcon icon={faHandPointLeft} color="green" /> */}
            </div>
            <div className="square-name">GO</div>
        </React.Fragment>
    );

};