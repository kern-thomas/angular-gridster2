import { NgZone } from '@angular/core';
import { GridsterPush } from './gridsterPush.service';
import { GridsterPushResize } from './gridsterPushResize.service';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import { GridsterComponentInterface } from './gridster.interface';
export declare class GridsterResizable {
    private zone;
    gridsterItem: GridsterItemComponentInterface;
    gridster: GridsterComponentInterface;
    lastMouse: {
        clientX: number;
        clientY: number;
    };
    itemBackup: Array<number>;
    directionFunction: Function;
    dragFunction: (event: any) => void;
    dragStopFunction: (event: any) => void;
    resizeEnabled: boolean;
    mousemove: Function;
    mouseup: Function;
    cancelOnBlur: Function;
    touchmove: Function;
    touchend: Function;
    touchcancel: Function;
    mousedown: Function;
    push: GridsterPush;
    pushResize: GridsterPushResize;
    minHeight: number;
    minWidth: number;
    offsetTop: number;
    offsetLeft: number;
    diffTop: number;
    diffLeft: number;
    diffRight: number;
    diffBottom: number;
    margin: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
    newPosition: number;
    constructor(gridsterItem: GridsterItemComponentInterface, gridster: GridsterComponentInterface, zone: NgZone);
    destroy(): void;
    dragStart(e: any): void;
    dragMove(e: any): void;
    dragStop(e: any): void;
    cancelResize(): void;
    makeResize(): void;
    handleN(e: any): void;
    handleW(e: any): void;
    handleS(e: any): void;
    handleE(e: any): void;
    handleNW(e: any): void;
    handleNE(e: any): void;
    handleSW(e: any): void;
    handleSE(e: any): void;
    toggle(): void;
    dragStartDelay(e: any): void;
}
