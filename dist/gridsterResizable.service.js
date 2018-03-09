"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterPush_service_1 = require("./gridsterPush.service");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var gridsterPushResize_service_1 = require("./gridsterPushResize.service");
var gridsterItemComponent_interface_1 = require("./gridsterItemComponent.interface");
var gridster_interface_1 = require("./gridster.interface");
var GridsterResizable = /** @class */ (function () {
    function GridsterResizable(gridsterItem, gridster, zone) {
        this.zone = zone;
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            clientX: 0,
            clientY: 0
        };
        this.itemBackup = [0, 0, 0, 0];
    }
    GridsterResizable.prototype.destroy = function () {
        delete this.gridster.movingItem;
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle();
        }
        delete this.gridsterItem;
        delete this.gridster;
    };
    GridsterResizable.prototype.dragStart = function (e) {
        var _this = this;
        switch (e.which) {
            case 1:
                // left mouse button
                break;
            case 2:
            case 3:
                // right or middle mouse button
                return;
        }
        if (this.gridster.options.resizable && this.gridster.options.resizable.start) {
            this.gridster.options.resizable.start(this.gridsterItem.item, this.gridsterItem, e);
        }
        e.stopPropagation();
        e.preventDefault();
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        this.zone.runOutsideAngular(function () {
            _this.mousemove = _this.gridsterItem.renderer.listen('document', 'mousemove', _this.dragFunction);
            _this.mouseup = _this.gridsterItem.renderer.listen('document', 'mouseup', _this.dragStopFunction);
            _this.cancelOnBlur = _this.gridsterItem.renderer.listen('window', 'blur', _this.dragStopFunction);
            _this.touchmove = _this.gridster.renderer.listen(_this.gridster.el, 'touchmove', _this.dragFunction);
            _this.touchend = _this.gridsterItem.renderer.listen('document', 'touchend', _this.dragStopFunction);
            _this.touchcancel = _this.gridsterItem.renderer.listen('document', 'touchcancel', _this.dragStopFunction);
        });
        this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
        this.lastMouse.clientX = e.clientX;
        this.lastMouse.clientY = e.clientY;
        this.left = this.gridsterItem.left;
        this.top = this.gridsterItem.top;
        this.width = this.gridsterItem.width;
        this.height = this.gridsterItem.height;
        this.bottom = this.gridsterItem.top + this.gridsterItem.height;
        this.right = this.gridsterItem.left + this.gridsterItem.width;
        this.margin = this.gridster.$options.margin;
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        this.diffLeft = e.clientX + this.offsetLeft - this.left;
        this.diffRight = e.clientX + this.offsetLeft - this.right;
        this.diffTop = e.clientY + this.offsetTop - this.top;
        this.diffBottom = e.clientY + this.offsetTop - this.bottom;
        this.minHeight = this.gridster.positionYToPixels(this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows)
            - this.margin;
        this.minWidth = this.gridster.positionXToPixels(this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols)
            - this.margin;
        this.gridster.movingItem = this.gridsterItem.$item;
        this.gridster.previewStyle();
        this.push = new gridsterPush_service_1.GridsterPush(this.gridsterItem);
        this.pushResize = new gridsterPushResize_service_1.GridsterPushResize(this.gridsterItem);
        this.gridster.dragInProgress = true;
        this.gridster.updateGrid();
        if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-n') > -1) {
            this.directionFunction = this.handleN;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-w') > -1) {
            this.directionFunction = this.handleW;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-s') > -1) {
            this.directionFunction = this.handleS;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-e') > -1) {
            this.directionFunction = this.handleE;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-nw') > -1) {
            this.directionFunction = this.handleNW;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-ne') > -1) {
            this.directionFunction = this.handleNE;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-sw') > -1) {
            this.directionFunction = this.handleSW;
        }
        else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-se') > -1) {
            this.directionFunction = this.handleSE;
        }
    };
    GridsterResizable.prototype.dragMove = function (e) {
        var _this = this;
        e.stopPropagation();
        e.preventDefault();
        gridsterUtils_service_1.GridsterUtils.checkTouchEvent(e);
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.directionFunction(e);
        this.lastMouse.clientX = e.clientX;
        this.lastMouse.clientY = e.clientY;
        this.zone.run(function () {
            _this.gridster.updateGrid();
        });
    };
    GridsterResizable.prototype.dragStop = function (e) {
        var _this = this;
        e.stopPropagation();
        e.preventDefault();
        this.mousemove();
        this.mouseup();
        this.cancelOnBlur();
        this.touchmove();
        this.touchend();
        this.touchcancel();
        this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', null);
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', null);
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', null);
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', null);
        this.gridster.dragInProgress = false;
        this.gridster.updateGrid();
        if (this.gridster.options.resizable && this.gridster.options.resizable.stop) {
            Promise.resolve(this.gridster.options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
                .then(this.makeResize.bind(this), this.cancelResize.bind(this));
        }
        else {
            this.makeResize();
        }
        setTimeout(function () {
            if (_this.gridster) {
                _this.gridster.movingItem = null;
                _this.gridster.previewStyle();
            }
        });
    };
    GridsterResizable.prototype.cancelResize = function () {
        this.gridsterItem.$item.cols = this.gridsterItem.item.cols || 1;
        this.gridsterItem.$item.rows = this.gridsterItem.item.rows || 1;
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.gridsterItem.setSize();
        this.push.restoreItems();
        this.pushResize.restoreItems();
        this.push.destroy();
        delete this.push;
        this.pushResize.destroy();
        delete this.pushResize;
    };
    GridsterResizable.prototype.makeResize = function () {
        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
        this.gridsterItem.setSize();
        this.push.setPushedItems();
        this.pushResize.setPushedItems();
        this.push.destroy();
        delete this.push;
        this.pushResize.destroy();
        delete this.pushResize;
    };
    GridsterResizable.prototype.handleN = function (e) {
        this.top = e.clientY + this.offsetTop - this.diffTop;
        this.height = this.bottom - this.top;
        if (this.minHeight > this.height) {
            this.height = this.minHeight;
            this.top = this.bottom - this.minHeight;
        }
        this.newPosition = this.gridster.pixelsToPositionY(this.top, Math.floor);
        if (this.gridsterItem.$item.y !== this.newPosition) {
            this.itemBackup[1] = this.gridsterItem.$item.y;
            this.itemBackup[3] = this.gridsterItem.$item.rows;
            this.gridsterItem.$item.rows += this.gridsterItem.$item.y - this.newPosition;
            this.gridsterItem.$item.y = this.newPosition;
            this.pushResize.pushItems(this.pushResize.fromSouth);
            this.push.pushItems(this.push.fromSouth, this.gridster.$options.disablePushOnResize);
            if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.y = this.itemBackup[1];
                this.gridsterItem.$item.rows = this.itemBackup[3];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', (this.gridster.positionYToPixels(this.gridsterItem.$item.y) - this.gridsterItem.top) + 'px');
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
            this.pushResize.checkPushBack();
            this.push.checkPushBack();
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', (this.top - this.gridsterItem.top) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
    };
    GridsterResizable.prototype.handleW = function (e) {
        this.left = e.clientX + this.offsetLeft - this.diffLeft;
        this.width = this.right - this.left;
        if (this.minWidth > this.width) {
            this.width = this.minWidth;
            this.left = this.right - this.minWidth;
        }
        this.newPosition = this.gridster.pixelsToPositionX(this.left, Math.floor);
        if (this.gridsterItem.$item.x !== this.newPosition) {
            this.itemBackup[0] = this.gridsterItem.$item.x;
            this.itemBackup[2] = this.gridsterItem.$item.cols;
            this.gridsterItem.$item.cols += this.gridsterItem.$item.x - this.newPosition;
            this.gridsterItem.$item.x = this.newPosition;
            this.pushResize.pushItems(this.pushResize.fromEast);
            this.push.pushItems(this.push.fromEast, this.gridster.$options.disablePushOnResize);
            if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.x = this.itemBackup[0];
                this.gridsterItem.$item.cols = this.itemBackup[2];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', (this.gridster.positionXToPixels(this.gridsterItem.$item.x) - this.gridsterItem.left) + 'px');
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
            this.pushResize.checkPushBack();
            this.push.checkPushBack();
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', (this.left - this.gridsterItem.left) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
    };
    GridsterResizable.prototype.handleS = function (e) {
        this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
        if (this.minHeight > this.height) {
            this.height = this.minHeight;
        }
        this.bottom = this.top + this.height;
        this.newPosition = this.gridster.pixelsToPositionY(this.bottom - this.margin, Math.ceil);
        if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.newPosition) {
            this.itemBackup[3] = this.gridsterItem.$item.rows;
            this.gridsterItem.$item.rows = this.newPosition - this.gridsterItem.$item.y;
            this.pushResize.pushItems(this.pushResize.fromNorth);
            this.push.pushItems(this.push.fromNorth, this.gridster.$options.disablePushOnResize);
            if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.rows = this.itemBackup[3];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
            this.pushResize.checkPushBack();
            this.push.checkPushBack();
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
    };
    GridsterResizable.prototype.handleE = function (e) {
        this.width = e.clientX + this.offsetLeft - this.diffRight - this.left;
        if (this.minWidth > this.width) {
            this.width = this.minWidth;
        }
        this.right = this.left + this.width;
        this.newPosition = this.gridster.pixelsToPositionX(this.right - this.margin, Math.ceil);
        if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.newPosition) {
            this.itemBackup[2] = this.gridsterItem.$item.cols;
            this.gridsterItem.$item.cols = this.newPosition - this.gridsterItem.$item.x;
            this.pushResize.pushItems(this.pushResize.fromWest);
            this.push.pushItems(this.push.fromWest, this.gridster.$options.disablePushOnResize);
            if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.cols = this.itemBackup[2];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
            this.pushResize.checkPushBack();
            this.push.checkPushBack();
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
    };
    GridsterResizable.prototype.handleNW = function (e) {
        this.handleN(e);
        this.handleW(e);
    };
    GridsterResizable.prototype.handleNE = function (e) {
        this.handleN(e);
        this.handleE(e);
    };
    GridsterResizable.prototype.handleSW = function (e) {
        this.handleS(e);
        this.handleW(e);
    };
    GridsterResizable.prototype.handleSE = function (e) {
        this.handleS(e);
        this.handleE(e);
    };
    GridsterResizable.prototype.toggle = function () {
        this.resizeEnabled = this.gridsterItem.canBeResized();
    };
    GridsterResizable.prototype.dragStartDelay = function (e) {
        var _this = this;
        gridsterUtils_service_1.GridsterUtils.checkTouchEvent(e);
        if (!this.gridster.$options.resizable.delayStart) {
            this.dragStart(e);
            return;
        }
        var timeout = setTimeout(function () {
            _this.dragStart(e);
            cancelDrag();
        }, this.gridster.$options.resizable.delayStart);
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
    GridsterResizable.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterResizable.ctorParameters = function () { return [
        { type: gridsterItemComponent_interface_1.GridsterItemComponentInterface, },
        { type: gridster_interface_1.GridsterComponentInterface, },
        { type: core_1.NgZone, },
    ]; };
    return GridsterResizable;
}());
exports.GridsterResizable = GridsterResizable;
