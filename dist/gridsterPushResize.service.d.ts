import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
export declare class GridsterPushResize {
    fromSouth: string;
    fromNorth: string;
    fromEast: string;
    fromWest: string;
    private pushedItems;
    private pushedItemsPath;
    private gridsterItem;
    private gridster;
    private tryPattern;
    constructor(gridsterItem: GridsterItemComponentInterface);
    destroy(): void;
    pushItems(direction: string): boolean;
    restoreItems(): void;
    setPushedItems(): void;
    checkPushBack(): void;
    private push(gridsterItem, direction);
    private trySouth(gridsterItemCollide, gridsterItem, direction);
    private tryNorth(gridsterItemCollide, gridsterItem, direction);
    private tryEast(gridsterItemCollide, gridsterItem, direction);
    private tryWest(gridsterItemCollide, gridsterItem, direction);
    private addToPushed(gridsterItem);
    private removeFromPushed(i);
    private checkPushedItem(pushedItem, i);
}
