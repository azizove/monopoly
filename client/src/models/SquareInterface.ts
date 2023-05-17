import { BoardSection } from "./BoardSection";
import { SquareType } from "./SquareType";

export interface SquareInterface {
    id: number;
    name: string;
    type?: SquareType;
    section?: BoardSection;
    groupId?: number ;
    icon?: string ;
}