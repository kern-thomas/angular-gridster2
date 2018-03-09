"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var GridsterGridComponent = /** @class */ (function () {
    function GridsterGridComponent(el, gridster, renderer, cdRef) {
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.gridLines = this;
        this.columns = [];
        this.rows = [];
        this.height = 0;
        this.width = 0;
        this.columnsHeight = 0;
        this.rowsWidth = 0;
    }
    GridsterGridComponent.prototype.ngOnDestroy = function () {
        delete this.el;
        delete this.gridster.gridLines;
        delete this.gridster;
    };
    GridsterGridComponent.prototype.updateGrid = function () {
        if (this.gridster.$options.displayGrid === 'always' && !this.gridster.mobile) {
            this.renderer.setStyle(this.el, 'display', 'block');
        }
        else if (this.gridster.$options.displayGrid === 'onDrag&Resize' && this.gridster.dragInProgress) {
            this.renderer.setStyle(this.el, 'display', 'block');
        }
        else if (this.gridster.$options.displayGrid === 'none' || !this.gridster.dragInProgress || this.gridster.mobile) {
            this.renderer.setStyle(this.el, 'display', 'none');
        }
        this.gridster.setGridDimensions();
        this.height = this.gridster.curRowHeight - this.gridster.$options.margin;
        this.width = this.gridster.curColWidth - this.gridster.$options.margin;
        this.columns.length = Math.max(this.gridster.columns, Math.floor(this.gridster.curWidth / this.gridster.curColWidth)) || 0;
        this.rows.length = Math.max(this.gridster.rows, Math.floor(this.gridster.curHeight / this.gridster.curRowHeight)) || 0;
        this.columnsHeight = this.gridster.curRowHeight * this.rows.length + this.getMarginTop(true) - this.gridster.$options.margin;
        this.rowsWidth = this.gridster.curColWidth * this.columns.length + this.getMarginLeft(true) - this.gridster.$options.margin;
        this.cdRef.markForCheck();
    };
    GridsterGridComponent.prototype.getMarginTop = function (isFirst) {
        if (isFirst && !this.gridster.$options.outerMargin) {
            return 0;
        }
        else if (isFirst && this.gridster.$options.outerMargin && this.gridster.$options.outerMarginTop !== null) {
            return this.gridster.$options.outerMarginTop;
        }
        else {
            return this.gridster.$options.margin;
        }
    };
    GridsterGridComponent.prototype.getMarginLeft = function (isFirst) {
        if (isFirst && !this.gridster.$options.outerMargin) {
            return 0;
        }
        else if (isFirst && this.gridster.$options.outerMargin && this.gridster.$options.outerMarginLeft !== null) {
            return this.gridster.$options.outerMarginLeft;
        }
        else {
            return this.gridster.$options.margin;
        }
    };
    GridsterGridComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster-grid',
                    template: "<div class=\"columns\" [style.height.px]=\"columnsHeight\">   <div class=\"column\" *ngFor=\"let column of columns; let isFirst = first;\" [style.min-width.px]=\"width\"        [style.margin-left.px]=\"getMarginLeft(isFirst)\"></div> </div> <div class=\"rows\" [style.width.px]=\"rowsWidth\">   <div class=\"row\" *ngFor=\"let row of rows; let isFirst = first;\" [style.height.px]=\"height\"        [style.margin-top.px]=\"getMarginTop(isFirst)\"></div> </div>",
                    styles: ["gridster-grid {   display: none;   position: absolute; }  gridster-grid .rows, gridster-grid .columns {   position: absolute; }  gridster-grid .columns {   display: flex;   flex-direction: row; }  gridster-grid .column, gridster-grid .row {   transition: .3s;   box-sizing: border-box; }  gridster-grid .column {   height: 100%;   border-left: 1px solid white;   border-right: 1px solid white; }  gridster-grid .row {   width: 100%;   border-top: 1px solid white;   border-bottom: 1px solid white; }"],
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    GridsterGridComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
        { type: core_1.Renderer2, },
        { type: core_1.ChangeDetectorRef, },
    ]; };
    return GridsterGridComponent;
}());
exports.GridsterGridComponent = GridsterGridComponent;
