import React from "react";
import { NyThemeData } from "../NyTheme";
import { ColorBar } from "./ColorBar";

export const PropertyDisplay = ({ name, id }) => {


    return (
        <React.Fragment>
            <ColorBar id={id} />
            <div className="square-name">{name}</div>
        </React.Fragment>
    );

};