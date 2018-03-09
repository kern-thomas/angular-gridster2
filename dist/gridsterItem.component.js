"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var gridsterDraggable_service_1 = require("./gridsterDraggable.service");
var gridsterResizable_service_1 = require("./gridsterResizable.service");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var GridsterItemComponent = /** @class */ (function () {
    function GridsterItemComponent(el, gridster, renderer, zone) {
        this.renderer = renderer;
        this.zone = zone;
        this.el = el.nativeElement;
        this.$item = {
            cols: -1,
            rows: -1,
            x: -1,
            y: -1,
        };
        this.gridster = gridster;
        this.drag = new gridsterDraggable_service_1.GridsterDraggable(this, gridster, this.zone);
        this.resize = new gridsterResizable_service_1.GridsterResizable(this, gridster, this.zone);
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
    GridsterItemComponent.prototype.setSize = function () {
        this.renderer.setStyle(this.el, 'display', this.notPlaced ? null : 'block');
        if (this.gridster.mobile) {
            this.renderer.setStyle(this.el, 'grid-column-start', null);
            this.renderer.setStyle(this.el, 'grid-column-end', null);
            this.renderer.setStyle(this.el, 'grid-row-start', null);
            this.renderer.setStyle(this.el, 'grid-row-end', null);
        }
        else {
            this.renderer.setStyle(this.el, 'grid-column-start', (this.$item.x + 1));
            this.renderer.setStyle(this.el, 'grid-column-end', ((this.$item.x + 1) + this.$item.cols));
            this.renderer.setStyle(this.el, 'grid-row-start', (this.$item.y + 1));
            this.renderer.setStyle(this.el, 'grid-row-end', ((this.$item.y + 1) + this.$item.rows));
        }
        var height = this.el.offsetHeight;
        var width = this.el.offsetWidth;
        if (!this.init && width > 0 && height > 0) {
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
        if (width !== this.width || height !== this.height) {
            if (this.gridster.options.itemResizeCallback) {
                this.gridster.options.itemResizeCallback(this.item, this);
            }
        }
        this.top = this.el.offsetTop;
        this.left = this.el.offsetLeft;
        this.width = width;
        this.height = height;
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
                    styles: ["gridster-item {   box-sizing: border-box;   z-index: 1;   position: relative;   overflow: hidden;   transition: .3s;   display: none;   background: white;   user-select: text; }  gridster-item.gridster-item-moving {   cursor: move; }  gridster-item.gridster-item-resizing, gridster-item.gridster-item-moving {   position: absolute;   width: 100%;   height: 100%;   transition: 0s;   z-index: 2;   box-shadow: 0 0 5px 5px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12); }  .gridster-item-resizable-handler {   position: absolute;   z-index: 2; }  .gridster-item-resizable-handler.handle-n {   cursor: n-resize;   height: 10px;   right: 0;   top: 0;   left: 0; }  .gridster-item-resizable-handler.handle-e {   cursor: e-resize;   width: 10px;   bottom: 0;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-s {   cursor: s-resize;   height: 10px;   right: 0;   bottom: 0;   left: 0; }  .gridster-item-resizable-handler.handle-w {   cursor: w-resize;   width: 10px;   left: 0;   top: 0;   bottom: 0; }  .gridster-item-resizable-handler.handle-ne {   cursor: ne-resize;   width: 10px;   height: 10px;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-nw {   cursor: nw-resize;   width: 10px;   height: 10px;   left: 0;   top: 0; }  .gridster-item-resizable-handler.handle-se {   cursor: se-resize;   width: 0;   height: 0;   right: 0;   bottom: 0;   border-style: solid;   border-width: 0 0 10px 10px;   border-color: transparent; }  .gridster-item-resizable-handler.handle-sw {   cursor: sw-resize;   width: 10px;   height: 10px;   left: 0;   bottom: 0; }  gridster-item:hover .gridster-item-resizable-handler.handle-se {   border-color: transparent transparent #ccc }"],
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    GridsterItemComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
        { type: core_1.Renderer2, },
        { type: core_1.NgZone, },
    ]; };
    GridsterItemComponent.propDecorators = {
        "item": [{ type: core_1.Input },],
    };
    return GridsterItemComponent;
}());
exports.GridsterItemComponent = GridsterItemComponent;
