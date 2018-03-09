import { GridsterResizeEventType } from './gridsterResizeEventType.interface';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
export declare function scroll(gridsterItem: GridsterItemComponentInterface, e: MouseEvent, lastMouse: any, calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType): void;
export declare function cancelScroll(): void;
