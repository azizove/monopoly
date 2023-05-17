import { BoardSection } from "./BoardSection";
import { HouseInterface } from "./HouseInterface";
import { SquareType } from "./SquareType";

export interface SquareInterface {
    id: number;
    name: string;
    rent?: number;
    type?: SquareType;
    section?: BoardSection;
    groupId?: number ;
    icon?: string ;
    houses?: HouseInterface[];
}

