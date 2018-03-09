import { ChangeDetectorRef, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { GridsterComponent } from './gridster.component';
export declare class GridsterGridComponent implements OnDestroy {
    renderer: Renderer2;
    private cdRef;
    el: any;
    gridster: GridsterComponent;
    columns: Array<any>;
    rows: Array<any>;
    height: number;
    width: number;
    columnsHeight: number;
    rowsWidth: number;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2, cdRef: ChangeDetectorRef);
    ngOnDestroy(): void;
    updateGrid(): void;
    getMarginTop(isFirst: boolean): number;
    getMarginLeft(isFirst: boolean): number;
}
