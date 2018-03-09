import { GridsterComponentInterface } from './gridster.interface';
export declare class GridsterUtils {
    static merge(obj1: any, obj2: any, properties: any): any;
    static debounce(func: Function, wait: number): () => void;
    static checkTouchEvent(e: any): void;
    static checkContentClassForEvent(gridster: GridsterComponentInterface, e: any): boolean;
    static checkContentClassForEmptyCellClickEvent(gridster: GridsterComponentInterface, e: any): boolean;
    static checkContentClass(target: any, current: any, contentClass: string): boolean;
    static compareItems(item1: {
        x: number;
        y: number;
    }, item2: {
        x: number;
        y: number;
    }): number;
}
