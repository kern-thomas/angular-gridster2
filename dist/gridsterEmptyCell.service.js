"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var gridster_interface_1 = require("./gridster.interface");
var GridsterEmptyCell = /** @class */ (function () {
    function GridsterEmptyCell(gridster) {
        this.gridster = gridster;
    }
    GridsterEmptyCell.prototype.destroy = function () {
        delete this.initialItem;
        delete this.gridster.movingItem;
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle();
        }
        delete this.gridster;
    };
    GridsterEmptyCell.prototype.updateOptions = function () {
        if (this.gridster.$options.enableEmptyCellClick && !this.emptyCellClick && this.gridster.options.emptyCellClickCallback) {
            this.emptyCellClick = this.gridster.renderer.listen(this.gridster.el, 'click', this.emptyCellClickCb.bind(this));
            this.emptyCellClickTouch = this.gridster.renderer.listen(this.gridster.el, 'touchend', this.emptyCellClickCb.bind(this));
        }
        else if (!this.gridster.$options.enableEmptyCellClick && this.emptyCellClick && this.emptyCellClickTouch) {
            this.emptyCellClick();
            this.emptyCellClickTouch();
            this.emptyCellClick = null;
            this.emptyCellClickTouch = null;
        }
        if (this.gridster.$options.enableEmptyCellContextMenu && !this.emptyCellContextMenu &&
            this.gridster.options.emptyCellContextMenuCallback) {
            this.emptyCellContextMenu = this.gridster.renderer.listen(this.gridster.el, 'contextmenu', this.emptyCellContextMenuCb.bind(this));
        }
        else if (!this.gridster.$options.enableEmptyCellContextMenu && this.emptyCellContextMenu) {
            this.emptyCellContextMenu();
            this.emptyCellContextMenu = null;
        }
        if (this.gridster.$options.enableEmptyCellDrop && !this.emptyCellDrop && this.gridster.options.emptyCellDropCallback) {
            this.emptyCellDrop = this.gridster.renderer.listen(this.gridster.el, 'drop', this.emptyCellDragDrop.bind(this));
            this.emptyCellMove = this.gridster.renderer.listen(this.gridster.el, 'dragover', this.emptyCellDragOver.bind(this));
        }
        else if (!this.gridster.$options.enableEmptyCellDrop && this.emptyCellDrop && this.emptyCellMove) {
            this.emptyCellDrop();
            this.emptyCellMove();
            this.emptyCellMove = null;
            this.emptyCellDrop = null;
        }
        if (this.gridster.$options.enableEmptyCellDrag && !this.emptyCellDrag && this.gridster.options.emptyCellDragCallback) {
            this.emptyCellDrag = this.gridster.renderer.listen(this.gridster.el, 'mousedown', this.emptyCellMouseDown.bind(this));
            this.emptyCellDragTouch = this.gridster.renderer.listen(this.gridster.el, 'touchstart', this.emptyCellMouseDown.bind(this));
        }
        else if (!this.gridster.$options.enableEmptyCellDrag && this.emptyCellDrag && this.emptyCellDragTouch) {
            this.emptyCellDrag();
            this.emptyCellDragTouch();
            this.emptyCellDrag = null;
            this.emptyCellDragTouch = null;
        }
    };
    GridsterEmptyCell.prototype.emptyCellClickCb = function (e) {
        if (this.gridster.movingItem || gridsterUtils_service_1.GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        var item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellClickCallback) {
            this.gridster.options.emptyCellClickCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    };
    GridsterEmptyCell.prototype.emptyCellContextMenuCb = function (e) {
        if (this.gridster.movingItem || gridsterUtils_service_1.GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellContextMenuCallback) {
            this.gridster.options.emptyCellContextMenuCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    };
    GridsterEmptyCell.prototype.emptyCellDragDrop = function (e) {
        var item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellDropCallback) {
            this.gridster.options.emptyCellDropCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    };
    GridsterEmptyCell.prototype.emptyCellDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.getValidItemFromEvent(e)) {
            e.dataTransfer.dropEffect = 'move';
        }
        else {
            e.dataTransfer.dropEffect = 'none';
        }
    };
    GridsterEmptyCell.prototype.emptyCellMouseDown = function (e) {
        if (gridsterUtils_service_1.GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        this.initialItem = item;
        this.gridster.movingItem = item;
        this.gridster.previewStyle();
        this.emptyCellMMove = this.gridster.renderer.listen('window', 'mousemove', this.emptyCellMouseMove.bind(this));
        this.emptyCellMMoveTouch = this.gridster.renderer.listen('window', 'touchmove', this.emptyCellMouseMove.bind(this));
        this.emptyCellUp = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp.bind(this));
        this.emptyCellUpTouch = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp.bind(this));
    };
    GridsterEmptyCell.prototype.emptyCellMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var item = this.getValidItemFromEvent(e, this.initialItem);
        if (!item) {
            return;
        }
        this.gridster.movingItem = item;
        this.gridster.previewStyle();
    };
    GridsterEmptyCell.prototype.emptyCellMouseUp = function (e) {
        var _this = this;
        this.emptyCellMMove();
        this.emptyCellMMoveTouch();
        this.emptyCellUp();
        this.emptyCellUpTouch();
        var item = this.getValidItemFromEvent(e, this.initialItem);
        if (item) {
            this.gridster.movingItem = item;
        }
        if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
            this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem);
        }
        setTimeout(function () {
            _this.initialItem = null;
            if (_this.gridster) {
                _this.gridster.movingItem = null;
                _this.gridster.previewStyle();
            }
        });
        this.gridster.cdRef.markForCheck();
    };
    GridsterEmptyCell.prototype.getValidItemFromEvent = function (e, oldItem) {
        e.preventDefault();
        e.stopPropagation();
        gridsterUtils_service_1.GridsterUtils.checkTouchEvent(e);
        var rect = this.gridster.el.getBoundingClientRect();
        var x = e.clientX + this.gridster.el.scrollLeft - rect.left;
        var y = e.clientY + this.gridster.el.scrollTop - rect.top;
        var item = {
            x: this.gridster.pixelsToPositionX(x, Math.floor),
            y: this.gridster.pixelsToPositionY(y, Math.floor),
            cols: this.gridster.$options.defaultItemCols,
            rows: this.gridster.$options.defaultItemRows
        };
        if (oldItem) {
            item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, this.gridster.$options.emptyCellDragMaxCols);
            item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, this.gridster.$options.emptyCellDragMaxRows);
            if (oldItem.x < item.x) {
                item.x = oldItem.x;
            }
            else if (oldItem.x - item.x > this.gridster.$options.emptyCellDragMaxCols - 1) {
                item.x = this.gridster.movingItem ? this.gridster.movingItem.x : 0;
            }
            if (oldItem.y < item.y) {
                item.y = oldItem.y;
            }
            else if (oldItem.y - item.y > this.gridster.$options.emptyCellDragMaxRows - 1) {
                item.y = this.gridster.movingItem ? this.gridster.movingItem.y : 0;
            }
        }
        if (this.gridster.checkCollision(item)) {
            return;
        }
        return item;
    };
    GridsterEmptyCell.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterEmptyCell.ctorParameters = function () { return [
        { type: gridster_interface_1.GridsterComponentInterface, },
    ]; };
    return GridsterEmptyCell;
}());
exports.GridsterEmptyCell = GridsterEmptyCell;
