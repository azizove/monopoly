import React from "react";
import { squareGroupColorMap } from "../SquareData";

interface Props {
    groupId: number;
}

export const ColorBar: React.FC<Props> = ({ groupId }) => {

    const getClassName = () => {
        return "square-color-bar " + squareGroupColorMap.get(groupId);
    };

    return (
        <div className={getClassName()}></div>
    );

};