import React from "react";

interface Props {
    name: string;
}

export const CentralParkDisplay: React.FC<Props> = ({ name }) => {

    return (
        <React.Fragment>
            <div className="icon"></div>
            <div className="square-name"> central park</div>
        </React.Fragment>
    );

};