"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_interface_1 = require("./gridster.interface");
var gridsterConfig_interface_1 = require("./gridsterConfig.interface");
var GridsterCompact = /** @class */ (function () {
    function GridsterCompact(gridster) {
        this.gridster = gridster;
    }
    GridsterCompact.prototype.destroy = function () {
        delete this.gridster;
    };
    GridsterCompact.prototype.checkCompact = function () {
        if (this.gridster.$options.compactType !== gridsterConfig_interface_1.CompactType.None) {
            if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactUp) {
                this.checkCompactUp();
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactLeft) {
                this.checkCompactLeft();
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactUpAndLeft) {
                this.checkCompactUp();
                this.checkCompactLeft();
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactLeftAndUp) {
                this.checkCompactLeft();
                this.checkCompactUp();
            }
        }
    };
    GridsterCompact.prototype.checkCompactItem = function (item) {
        if (this.gridster.$options.compactType !== gridsterConfig_interface_1.CompactType.None) {
            if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactUp) {
                this.moveUpTillCollision(item);
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactLeft) {
                this.moveLeftTillCollision(item);
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactUpAndLeft) {
                this.moveUpTillCollision(item);
                this.moveLeftTillCollision(item);
            }
            else if (this.gridster.$options.compactType === gridsterConfig_interface_1.CompactType.CompactLeftAndUp) {
                this.moveLeftTillCollision(item);
                this.moveUpTillCollision(item);
            }
        }
    };
    GridsterCompact.prototype.checkCompactUp = function () {
        var widgetMovedUp = false, widget, moved;
        var l = this.gridster.grid.length;
        for (var i = 0; i < l; i++) {
            widget = this.gridster.grid[i];
            if (widget.$item.compactEnabled === false) {
                continue;
            }
            moved = this.moveUpTillCollision(widget.$item);
            if (moved) {
                widgetMovedUp = true;
                widget.item.y = widget.$item.y;
                widget.itemChanged();
            }
        }
        if (widgetMovedUp) {
            this.checkCompact();
        }
    };
    GridsterCompact.prototype.moveUpTillCollision = function (item) {
        item.y -= 1;
        if (this.gridster.checkCollision(item)) {
            item.y += 1;
            return false;
        }
        else {
            this.moveUpTillCollision(item);
            return true;
        }
    };
    GridsterCompact.prototype.checkCompactLeft = function () {
        var widgetMovedUp = false, widget, moved;
        var l = this.gridster.grid.length;
        for (var i = 0; i < l; i++) {
            widget = this.gridster.grid[i];
            if (widget.$item.compactEnabled === false) {
                continue;
            }
            moved = this.moveLeftTillCollision(widget.$item);
            if (moved) {
                widgetMovedUp = true;
                widget.item.x = widget.$item.x;
                widget.itemChanged();
            }
        }
        if (widgetMovedUp) {
            this.checkCompact();
        }
    };
    GridsterCompact.prototype.moveLeftTillCollision = function (item) {
        item.x -= 1;
        if (this.gridster.checkCollision(item)) {
            item.x += 1;
            return false;
        }
        else {
            this.moveLeftTillCollision(item);
            return true;
        }
    };
    GridsterCompact.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterCompact.ctorParameters = function () { return [
        { type: gridster_interface_1.GridsterComponentInterface, },
    ]; };
    return GridsterCompact;
}());
exports.GridsterCompact = GridsterCompact;
