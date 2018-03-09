import { GridsterComponentInterface } from './gridster.interface';
import { GridsterItemS } from './gridsterItemS.interface';
export declare class GridsterCompact {
    private gridster;
    constructor(gridster: GridsterComponentInterface);
    destroy(): void;
    checkCompact(): void;
    checkCompactItem(item: GridsterItemS): void;
    checkCompactUp(): void;
    moveUpTillCollision(item: GridsterItemS): boolean;
    checkCompactLeft(): void;
    moveLeftTillCollision(item: GridsterItemS): boolean;
}
