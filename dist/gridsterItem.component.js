"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var gridsterDraggable_service_1 = require("./gridsterDraggable.service");
var gridsterResizable_service_1 = require("./gridsterResizable.service");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var GridsterItemComponent = /** @class */ (function () {
    function GridsterItemComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.$item = {
            cols: -1,
            rows: -1,
            x: -1,
            y: -1,
        };
        this.gridster = gridster;
        this.drag = new gridsterDraggable_service_1.GridsterDraggable(this, gridster);
        this.resize = new gridsterResizable_service_1.GridsterResizable(this, gridster);
    }
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.updateOptions();
        this.gridster.addItem(this);
    };
    GridsterItemComponent.prototype.updateOptions = function () {
        this.$item = gridsterUtils_service_1.GridsterUtils.merge(this.$item, this.item, {
            cols: undefined,
            rows: undefined,
            x: undefined,
            y: undefined,
            dragEnabled: undefined,
            resizeEnabled: undefined,
            compactEnabled: undefined,
            maxItemRows: undefined,
            minItemRows: undefined,
            maxItemCols: undefined,
            minItemCols: undefined,
            maxItemArea: undefined,
            minItemArea: undefined,
        });
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.gridster.removeItem(this);
        delete this.gridster;
        this.drag.destroy();
        delete this.drag;
        this.resize.destroy();
        delete this.resize;
    };
    GridsterItemComponent.prototype.setSize = function (noCheck) {
        if (this.gridster.mobile) {
            this.top = 0;
            this.left = 0;
            if (this.gridster.$options.keepFixedWidthInMobile) {
                this.width = this.$item.cols * this.gridster.$options.fixedColWidth;
            }
            else {
                this.width = this.gridster.curWidth - (this.gridster.$options.outerMargin ? 2 * this.gridster.$options.margin : 0);
            }
            if (this.gridster.$options.keepFixedHeightInMobile) {
                this.height = this.$item.rows * this.gridster.$options.fixedRowHeight;
            }
            else {
                this.height = this.width / 2;
            }
        }
        else {
            this.top = this.$item.y * this.gridster.curRowHeight;
            this.left = this.$item.x * this.gridster.curColWidth;
            this.width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
            this.height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
        }
        if (!noCheck && this.top === this.itemTop && this.left === this.itemLeft &&
            this.width === this.itemWidth && this.height === this.itemHeight) {
            return;
        }
        if (this.gridster.$options.outerMargin) {
            if (this.gridster.$options.outerMarginTop !== null) {
                this.itemMargin = this.gridster.$options.outerMarginTop + 'px ';
            }
            else {
                this.itemMargin = this.gridster.$options.margin + 'px ';
            }
            if (this.gridster.$options.outerMarginRight !== null) {
                this.itemMargin += this.gridster.$options.outerMarginRight + 'px ';
            }
            else {
                this.itemMargin += this.gridster.$options.margin + 'px ';
            }
            if (this.gridster.$options.outerMarginBottom !== null) {
                this.itemMargin += this.gridster.$options.outerMarginBottom + 'px ';
            }
            else {
                this.itemMargin += this.gridster.$options.margin + 'px ';
            }
            if (this.gridster.$options.outerMarginLeft !== null) {
                this.itemMargin += this.gridster.$options.outerMarginLeft + 'px';
            }
            else {
                this.itemMargin += this.gridster.$options.margin + 'px';
            }
        }
        else {
            this.itemMargin = 0 + 'px';
        }
        this.renderer.setStyle(this.el, 'display', this.notPlaced ? 'none' : 'block');
        this.renderer.setStyle(this.el, 'top', this.top + 'px');
        this.renderer.setStyle(this.el, 'left', this.left + 'px');
        this.renderer.setStyle(this.el, 'width', this.width + 'px');
        this.renderer.setStyle(this.el, 'height', this.height + 'px');
        this.renderer.setStyle(this.el, 'margin', this.itemMargin);
        if (!this.init && this.width > 0 && this.height > 0) {
            this.init = true;
            if (this.item.initCallback) {
                this.item.initCallback(this.item, this);
            }
            if (this.gridster.options.itemInitCallback) {
                this.gridster.options.itemInitCallback(this.item, this);
            }
            if (this.gridster.$options.scrollToNewItems) {
                this.el.scrollIntoView(false);
            }
        }
        if (this.width !== this.itemWidth || this.height !== this.itemHeight) {
            if (this.gridster.options.itemResizeCallback) {
                this.gridster.options.itemResizeCallback(this.item, this);
            }
        }
        this.itemTop = this.top;
        this.itemLeft = this.left;
        this.itemWidth = this.width;
        this.itemHeight = this.height;
    };
    GridsterItemComponent.prototype.itemChanged = function () {
        if (this.gridster.options.itemChangeCallback) {
            this.gridster.options.itemChangeCallback(this.item, this);
        }
    };
    GridsterItemComponent.prototype.checkItemChanges = function (newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
            return;
        }
        if (this.gridster.checkCollision(this.$item)) {
            this.$item.x = oldValue.x || 0;
            this.$item.y = oldValue.y || 0;
            this.$item.cols = oldValue.cols || 1;
            this.$item.rows = oldValue.rows || 1;
        }
        else {
            this.item.cols = this.$item.cols;
            this.item.rows = this.$item.rows;
            this.item.x = this.$item.x;
            this.item.y = this.$item.y;
            this.gridster.calculateLayout();
            this.itemChanged();
        }
    };
    GridsterItemComponent.prototype.canBeDragged = function () {
        return !this.gridster.mobile &&
            (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
    };
    GridsterItemComponent.prototype.canBeResized = function () {
        return !this.gridster.mobile &&
            (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
    };
    GridsterItemComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster-item',
                    template: "<ng-content></ng-content> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.s || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-s\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.e || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-e\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.n || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-n\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.w || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-w\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.se || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-se\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.ne || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-ne\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.sw || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-sw\"></div> <div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"      [hidden]=\"!gridster.$options.resizable.handles.nw || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-nw\"></div>",
                    styles: ["gridster-item {   box-sizing: border-box;   z-index: 1;   position: absolute;   overflow: hidden;   transition: .3s;   display: none;   background: white;   user-select: text; }  gridster-item.gridster-item-moving {   cursor: move; }  gridster-item.gridster-item-resizing, gridster-item.gridster-item-moving {   transition: 0s;   z-index: 2;   box-shadow: 0 0 5px 5px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12); }  .gridster-item-resizable-handler {   position: absolute;   z-index: 2; }  .gridster-item-resizable-handler.handle-n {   cursor: n-resize;   height: 10px;   right: 0;   top: 0;   left: 0; }  .gridster-item-resizable-handler.handle-e {   cursor: e-resize;   width: 10px;   bottom: 0;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-s {   cursor: s-resize;   height: 10px;   right: 0;   bottom: 0;   left: 0; }  .gridster-item-resizable-handler.handle-w {   cursor: w-resize;   width: 10px;   left: 0;   top: 0;   bottom: 0; }  .gridster-item-resizable-handler.handle-ne {   cursor: ne-resize;   width: 10px;   height: 10px;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-nw {   cursor: nw-resize;   width: 10px;   height: 10px;   left: 0;   top: 0; }  .gridster-item-resizable-handler.handle-se {   cursor: se-resize;   width: 0;   height: 0;   right: 0;   bottom: 0;   border-style: solid;   border-width: 0 0 10px 10px;   border-color: transparent; }  .gridster-item-resizable-handler.handle-sw {   cursor: sw-resize;   width: 10px;   height: 10px;   left: 0;   bottom: 0; }  gridster-item:hover .gridster-item-resizable-handler.handle-se {   border-color: transparent transparent #ccc }"],
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    GridsterItemComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
        { type: core_1.Renderer2, },
    ]; };
    GridsterItemComponent.propDecorators = {
        "item": [{ type: core_1.Input },],
    };
    return GridsterItemComponent;
}());
exports.GridsterItemComponent = GridsterItemComponent;
