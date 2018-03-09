"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItemComponent_interface_1 = require("./gridsterItemComponent.interface");
var GridsterSwap = /** @class */ (function () {
    function GridsterSwap(gridsterItem) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridsterItem.gridster;
    }
    GridsterSwap.prototype.destroy = function () {
        delete this.gridster;
        delete this.gridsterItem;
        delete this.swapedItem;
    };
    GridsterSwap.prototype.swapItems = function () {
        if (this.gridster.$options.swap) {
            this.checkSwapBack();
            this.checkSwap(this.gridsterItem);
        }
    };
    GridsterSwap.prototype.checkSwapBack = function () {
        if (this.swapedItem) {
            var x = this.swapedItem.$item.x;
            var y = this.swapedItem.$item.y;
            this.swapedItem.$item.x = this.swapedItem.item.x || 0;
            this.swapedItem.$item.y = this.swapedItem.item.y || 0;
            if (this.gridster.checkCollision(this.swapedItem.$item)) {
                this.swapedItem.$item.x = x;
                this.swapedItem.$item.y = y;
            }
            else {
                this.swapedItem.setSize(true);
                this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
                this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
                this.swapedItem = undefined;
            }
        }
    };
    GridsterSwap.prototype.restoreSwapItem = function () {
        if (this.swapedItem) {
            this.swapedItem.$item.x = this.swapedItem.item.x || 0;
            this.swapedItem.$item.y = this.swapedItem.item.y || 0;
            this.swapedItem.setSize(true);
            this.swapedItem = undefined;
        }
    };
    GridsterSwap.prototype.setSwapItem = function () {
        if (this.swapedItem) {
            this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
            this.swapedItem = undefined;
        }
    };
    GridsterSwap.prototype.checkSwap = function (pushedBy) {
        var gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
            var gridsterItemCollide = gridsterItemCollision;
            var copyCollisionX = gridsterItemCollide.$item.x;
            var copyCollisionY = gridsterItemCollide.$item.y;
            var copyX = pushedBy.$item.x;
            var copyY = pushedBy.$item.y;
            gridsterItemCollide.$item.x = pushedBy.item.x || 0;
            gridsterItemCollide.$item.y = pushedBy.item.y || 0;
            pushedBy.$item.x = gridsterItemCollide.item.x || 0;
            pushedBy.$item.y = gridsterItemCollide.item.y || 0;
            if (this.gridster.checkCollision(gridsterItemCollide.$item) || this.gridster.checkCollision(pushedBy.$item)) {
                pushedBy.$item.x = copyX;
                pushedBy.$item.y = copyY;
                gridsterItemCollide.$item.x = copyCollisionX;
                gridsterItemCollide.$item.y = copyCollisionY;
            }
            else {
                gridsterItemCollide.setSize(true);
                this.swapedItem = gridsterItemCollide;
            }
        }
    };
    GridsterSwap.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterSwap.ctorParameters = function () { return [
        { type: gridsterItemComponent_interface_1.GridsterItemComponentInterface, },
    ]; };
    return GridsterSwap;
}());
exports.GridsterSwap = GridsterSwap;
