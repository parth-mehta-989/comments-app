import { Time } from "@angular/common";

export interface Comment {
    id: number,
    parent_id: number,
    data: string,
    username: string,
    created: Date,
    updated: Date,
    children: Comment[]
}

