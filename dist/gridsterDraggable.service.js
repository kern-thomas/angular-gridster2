"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterSwap_service_1 = require("./gridsterSwap.service");
var gridsterScroll_service_1 = require("./gridsterScroll.service");
var gridsterPush_service_1 = require("./gridsterPush.service");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var gridsterItemComponent_interface_1 = require("./gridsterItemComponent.interface");
var gridster_interface_1 = require("./gridster.interface");
var GridsterDraggable = /** @class */ (function () {
    function GridsterDraggable(gridsterItem, gridster) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            clientX: 0,
            clientY: 0
        };
        this.path = [];
    }
    GridsterDraggable.prototype.destroy = function () {
        delete this.gridster.movingItem;
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle(true);
        }
        delete this.gridsterItem;
        delete this.gridster;
        if (this.mousedown) {
            this.mousedown();
            this.touchstart();
        }
    };
    GridsterDraggable.prototype.dragStart = function (e) {
        switch (e.which) {
            case 1:
                // left mouse button
                break;
            case 2:
            case 3:
                // right or middle mouse button
                return;
        }
        if (this.gridster.options.draggable && this.gridster.options.draggable.start) {
            this.gridster.options.draggable.start(this.gridsterItem.item, this.gridsterItem, e);
        }
        e.stopPropagation();
        e.preventDefault();
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
        this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
        this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
        this.touchmove = this.gridster.renderer.listen(this.gridster.el, 'touchmove', this.dragFunction);
        this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
        this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
        this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
        this.margin = this.gridster.$options.margin;
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        this.left = this.gridsterItem.left;
        this.top = this.gridsterItem.top;
        this.width = this.gridsterItem.width;
        this.height = this.gridsterItem.height;
        this.diffLeft = e.clientX + this.offsetLeft - this.margin - this.left;
        this.diffTop = e.clientY + this.offsetTop - this.margin - this.top;
        this.gridster.movingItem = this.gridsterItem.$item;
        this.gridster.previewStyle(true);
        this.push = new gridsterPush_service_1.GridsterPush(this.gridsterItem);
        this.swap = new gridsterSwap_service_1.GridsterSwap(this.gridsterItem);
        this.gridster.dragInProgress = true;
        this.gridster.gridLines.updateGrid();
        this.path.push({ x: this.gridsterItem.item.x || 0, y: this.gridsterItem.item.y || 0 });
    };
    GridsterDraggable.prototype.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        gridsterUtils_service_1.GridsterUtils.checkTouchEvent(e);
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        gridsterScroll_service_1.scroll(this.gridsterItem, e, this.lastMouse, this.calculateItemPositionFromMousePosition.bind(this));
        this.calculateItemPositionFromMousePosition(e);
        this.lastMouse.clientX = e.clientX;
        this.lastMouse.clientY = e.clientY;
        this.gridster.gridLines.updateGrid();
    };
    GridsterDraggable.prototype.calculateItemPositionFromMousePosition = function (e) {
        this.left = e.clientX + this.offsetLeft - this.margin - this.diffLeft;
        this.top = e.clientY + this.offsetTop - this.margin - this.diffTop;
        this.calculateItemPosition();
    };
    GridsterDraggable.prototype.dragStop = function (e) {
        var _this = this;
        e.stopPropagation();
        e.preventDefault();
        gridsterScroll_service_1.cancelScroll();
        this.cancelOnBlur();
        this.mousemove();
        this.mouseup();
        this.touchmove();
        this.touchend();
        this.touchcancel();
        this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
        this.gridster.dragInProgress = false;
        this.gridster.gridLines.updateGrid();
        this.path = [];
        if (this.gridster.options.draggable && this.gridster.options.draggable.stop) {
            Promise.resolve(this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
                .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
        }
        else {
            this.makeDrag();
        }
        setTimeout(function () {
            if (_this.gridster) {
                _this.gridster.movingItem = null;
                _this.gridster.previewStyle(true);
            }
        });
    };
    GridsterDraggable.prototype.cancelDrag = function () {
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.gridsterItem.setSize(true);
        this.push.restoreItems();
        this.swap.restoreSwapItem();
        this.push.destroy();
        delete this.push;
        this.swap.destroy();
        delete this.swap;
    };
    GridsterDraggable.prototype.makeDrag = function () {
        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
        this.gridsterItem.setSize(true);
        this.push.setPushedItems();
        this.swap.setSwapItem();
        this.push.destroy();
        delete this.push;
        this.swap.destroy();
        delete this.swap;
    };
    GridsterDraggable.prototype.calculateItemPosition = function () {
        this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
        this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
        this.positionXBackup = this.gridsterItem.$item.x;
        this.positionYBackup = this.gridsterItem.$item.y;
        this.gridsterItem.$item.x = this.positionX;
        if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
            this.gridsterItem.$item.x = this.positionXBackup;
        }
        else {
            this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.left + 'px');
        }
        this.gridsterItem.$item.y = this.positionY;
        if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
            this.gridsterItem.$item.y = this.positionYBackup;
        }
        else {
            this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.top + 'px');
        }
        if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
            var lastPosition = this.path[this.path.length - 1];
            var direction = '';
            if (lastPosition.x < this.gridsterItem.$item.x) {
                direction = this.push.fromWest;
            }
            else if (lastPosition.x > this.gridsterItem.$item.x) {
                direction = this.push.fromEast;
            }
            else if (lastPosition.y < this.gridsterItem.$item.y) {
                direction = this.push.fromNorth;
            }
            else if (lastPosition.y > this.gridsterItem.$item.y) {
                direction = this.push.fromSouth;
            }
            this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
            this.swap.swapItems();
            if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.x = this.positionXBackup;
                this.gridsterItem.$item.y = this.positionYBackup;
            }
            else {
                this.path.push({ x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y });
                this.gridster.previewStyle(true);
            }
            this.push.checkPushBack();
        }
    };
    GridsterDraggable.prototype.toggle = function () {
        var enableDrag = this.gridsterItem.canBeDragged();
        if (!this.enabled && enableDrag) {
            this.enabled = !this.enabled;
            this.dragStartFunction = this.dragStartDelay.bind(this);
            this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
            this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
        }
        else if (this.enabled && !enableDrag) {
            this.enabled = !this.enabled;
            this.mousedown();
            this.touchstart();
        }
    };
    GridsterDraggable.prototype.dragStartDelay = function (e) {
        var _this = this;
        if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') > -1) {
            return;
        }
        if (gridsterUtils_service_1.GridsterUtils.checkContentClassForEvent(this.gridster, e)) {
            return;
        }
        gridsterUtils_service_1.GridsterUtils.checkTouchEvent(e);
        if (!this.gridster.$options.draggable.delayStart) {
            this.dragStart(e);
            return;
        }
        var timeout = setTimeout(function () {
            _this.dragStart(e);
            cancelDrag();
        }, this.gridster.$options.draggable.delayStart);
        var cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
        var cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
        var cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
        var cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
        var cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);
        function cancelMove(eventMove) {
            gridsterUtils_service_1.GridsterUtils.checkTouchEvent(eventMove);
            if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
                cancelDrag();
            }
        }
        function cancelDrag() {
            clearTimeout(timeout);
            cancelOnBlur();
            cancelMouse();
            cancelTouchMove();
            cancelTouchEnd();
            cancelTouchCancel();
        }
    };
    GridsterDraggable.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterDraggable.ctorParameters = function () { return [
        { type: gridsterItemComponent_interface_1.GridsterItemComponentInterface, },
        { type: gridster_interface_1.GridsterComponentInterface, },
    ]; };
    return GridsterDraggable;
}());
exports.GridsterDraggable = GridsterDraggable;
