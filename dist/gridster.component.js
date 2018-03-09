"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterConfig_constant_1 = require("./gridsterConfig.constant");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var gridsterEmptyCell_service_1 = require("./gridsterEmptyCell.service");
var gridsterCompact_service_1 = require("./gridsterCompact.service");
var GridsterComponent = /** @class */ (function () {
    function GridsterComponent(el, renderer, cdRef) {
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.el = el.nativeElement;
        this.$options = JSON.parse(JSON.stringify(gridsterConfig_constant_1.GridsterConfigService));
        this.calculateLayoutDebounce = gridsterUtils_service_1.GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
        this.mobile = false;
        this.curWidth = 0;
        this.curHeight = 0;
        this.grid = [];
        this.curColWidth = 0;
        this.curRowHeight = 0;
        this.dragInProgress = false;
        this.emptyCell = new gridsterEmptyCell_service_1.GridsterEmptyCell(this);
        this.compact = new gridsterCompact_service_1.GridsterCompact(this);
    }
    GridsterComponent.checkCollisionTwoItems = function (item, item2) {
        return item.x < item2.x + item2.cols
            && item.x + item.cols > item2.x
            && item.y < item2.y + item2.rows
            && item.y + item.rows > item2.y;
    };
    GridsterComponent.prototype.ngOnInit = function () {
        if (this.options.initCallback) {
            this.options.initCallback(this);
        }
    };
    GridsterComponent.prototype.ngOnChanges = function (changes) {
        if (changes.options) {
            this.setOptions();
            this.options.api = {
                optionsChanged: this.optionsChanged.bind(this),
                resize: this.onResize.bind(this),
                getNextPossiblePosition: this.getNextPossiblePosition.bind(this),
                getFirstPossiblePosition: this.getFirstPossiblePosition.bind(this),
                getLastPossiblePosition: this.getLastPossiblePosition.bind(this),
            };
            this.columns = this.$options.minCols;
            this.rows = this.$options.minRows;
            this.setGridSize();
            this.calculateLayoutDebounce();
        }
    };
    GridsterComponent.prototype.resize = function () {
        var height;
        var width;
        if (this.$options.gridType === 'fit' && !this.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
            this.onResize();
        }
    };
    GridsterComponent.prototype.setOptions = function () {
        this.$options = gridsterUtils_service_1.GridsterUtils.merge(this.$options, this.options, this.$options);
        if (!this.$options.disableWindowResize && !this.windowResize) {
            this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this));
        }
        else if (this.$options.disableWindowResize && this.windowResize) {
            this.windowResize();
            this.windowResize = null;
        }
        this.emptyCell.updateOptions();
    };
    GridsterComponent.prototype.optionsChanged = function () {
        this.setOptions();
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.updateOptions();
        }
        this.calculateLayout();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        if (this.windowResize) {
            this.windowResize();
        }
        if (this.options.destroyCallback) {
            this.options.destroyCallback(this);
        }
        if (this.options.api) {
            this.options.api.resize = undefined;
            this.options.api.optionsChanged = undefined;
            this.options.api.getNextPossiblePosition = undefined;
            this.options.api = undefined;
        }
        this.emptyCell.destroy();
        delete this.emptyCell;
        this.compact.destroy();
        delete this.compact;
    };
    GridsterComponent.prototype.onResize = function () {
        this.setGridSize();
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.checkIfToResize = function () {
        var clientWidth = this.el.clientWidth;
        var offsetWidth = this.el.offsetWidth;
        var scrollWidth = this.el.scrollWidth;
        var clientHeight = this.el.clientHeight;
        var offsetHeight = this.el.offsetHeight;
        var scrollHeight = this.el.scrollHeight;
        var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
            && scrollHeight - offsetHeight < offsetWidth - clientWidth;
        var horizontalScrollPresent = clientHeight < offsetHeight
            && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
        if (verticalScrollPresent) {
            return false;
        }
        return !horizontalScrollPresent;
    };
    GridsterComponent.prototype.setGridSize = function () {
        var width = this.el.clientWidth;
        var height = this.el.clientHeight;
        if (this.$options.gridType === 'fit' && !this.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        this.curWidth = width;
        this.curHeight = height;
    };
    GridsterComponent.prototype.setGridDimensions = function () {
        this.setGridSize();
        if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.addClass(this.el, 'mobile');
        }
        else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.removeClass(this.el, 'mobile');
        }
        var rows = this.$options.minRows, columns = this.$options.minCols;
        var widgetsIndex = this.grid.length - 1;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            rows = Math.max(rows, this.grid[widgetsIndex].$item.y + this.grid[widgetsIndex].$item.rows);
            columns = Math.max(columns, this.grid[widgetsIndex].$item.x + this.grid[widgetsIndex].$item.cols);
        }
        this.columns = columns;
        this.rows = rows;
    };
    GridsterComponent.prototype.calculateLayout = function () {
        // check to compact
        if (this.compact) {
            this.compact.checkCompact();
        }
        this.setGridDimensions();
        if (this.$options.outerMargin) {
            var marginWidth = -this.$options.margin;
            if (this.$options.outerMarginLeft !== null) {
                marginWidth += this.$options.outerMarginLeft;
            }
            else {
                marginWidth += this.$options.margin;
            }
            if (this.$options.outerMarginRight !== null) {
                marginWidth += this.$options.outerMarginRight;
            }
            else {
                marginWidth += this.$options.margin;
            }
            this.curColWidth = (this.curWidth - marginWidth) / this.columns;
            var marginHeight = -this.$options.margin;
            if (this.$options.outerMarginTop !== null) {
                marginHeight += this.$options.outerMarginTop;
            }
            else {
                marginHeight += this.$options.margin;
            }
            if (this.$options.outerMarginBottom !== null) {
                marginHeight += this.$options.outerMarginBottom;
            }
            else {
                marginHeight += this.$options.margin;
            }
            this.curRowHeight = (this.curHeight - marginHeight) / this.rows;
        }
        else {
            this.curColWidth = (this.curWidth + this.$options.margin) / this.columns;
            this.curRowHeight = (this.curHeight + this.$options.margin) / this.rows;
        }
        var addClass = '';
        var removeClass1 = '';
        var removeClass2 = '';
        var removeClass3 = '';
        if (this.$options.gridType === 'fit') {
            addClass = 'fit';
            removeClass1 = 'scrollVertical';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'scrollVertical') {
            this.curRowHeight = this.curColWidth;
            addClass = 'scrollVertical';
            removeClass1 = 'fit';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'scrollHorizontal') {
            this.curColWidth = this.curRowHeight;
            addClass = 'scrollHorizontal';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'fixed') {
            this.curColWidth = this.$options.fixedColWidth + (this.$options.ignoreMarginInRow ? 0 : this.$options.margin);
            this.curRowHeight = this.$options.fixedRowHeight + (this.$options.ignoreMarginInRow ? 0 : this.$options.margin);
            addClass = 'fixed';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'scrollHorizontal';
        }
        else if (this.$options.gridType === 'verticalFixed') {
            this.curRowHeight = this.$options.fixedRowHeight + (this.$options.ignoreMarginInRow ? 0 : this.$options.margin);
            addClass = 'scrollVertical';
            removeClass1 = 'fit';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'horizontalFixed') {
            this.curColWidth = this.$options.fixedColWidth + (this.$options.ignoreMarginInRow ? 0 : this.$options.margin);
            addClass = 'scrollHorizontal';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'fixed';
        }
        this.renderer.addClass(this.el, addClass);
        this.renderer.removeClass(this.el, removeClass1);
        this.renderer.removeClass(this.el, removeClass2);
        this.renderer.removeClass(this.el, removeClass3);
        if (this.gridLines) {
            this.gridLines.updateGrid();
        }
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.setSize(false);
            widget.drag.toggle();
            widget.resize.toggle();
        }
        setTimeout(this.resize.bind(this), 100);
    };
    GridsterComponent.prototype.addItem = function (itemComponent) {
        if (itemComponent.$item.cols === undefined) {
            itemComponent.$item.cols = this.$options.defaultItemCols;
            itemComponent.item.cols = itemComponent.$item.cols;
            itemComponent.itemChanged();
        }
        if (itemComponent.$item.rows === undefined) {
            itemComponent.$item.rows = this.$options.defaultItemRows;
            itemComponent.item.rows = itemComponent.$item.rows;
            itemComponent.itemChanged();
        }
        if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
            this.autoPositionItem(itemComponent);
        }
        else if (this.checkCollision(itemComponent.$item)) {
            if (!this.$options.disableWarnings) {
                console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
                    JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
            }
            this.autoPositionItem(itemComponent);
        }
        this.grid.push(itemComponent);
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.removeItem = function (itemComponent) {
        this.grid.splice(this.grid.indexOf(itemComponent), 1);
        this.calculateLayoutDebounce();
        if (this.options.itemRemovedCallback) {
            this.options.itemRemovedCallback(itemComponent.item, itemComponent);
        }
    };
    GridsterComponent.prototype.checkCollision = function (item) {
        return this.checkGridCollision(item) || this.findItemWithItem(item);
    };
    GridsterComponent.prototype.checkGridCollision = function (item) {
        var noNegativePosition = item.y > -1 && item.x > -1;
        var maxGridCols = item.cols + item.x <= this.$options.maxCols;
        var maxGridRows = item.rows + item.y <= this.$options.maxRows;
        var maxItemCols = item.maxItemCols === undefined ? this.$options.maxItemCols : item.maxItemCols;
        var minItemCols = item.minItemCols === undefined ? this.$options.minItemCols : item.minItemCols;
        var maxItemRows = item.maxItemRows === undefined ? this.$options.maxItemRows : item.maxItemRows;
        var minItemRows = item.minItemRows === undefined ? this.$options.minItemRows : item.minItemRows;
        var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
        var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
        var minAreaLimit = item.minItemArea === undefined ? this.$options.minItemArea : item.minItemArea;
        var maxAreaLimit = item.maxItemArea === undefined ? this.$options.maxItemArea : item.maxItemArea;
        var area = item.cols * item.rows;
        var inMinArea = minAreaLimit <= area;
        var inMaxArea = maxAreaLimit >= area;
        return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
    };
    GridsterComponent.prototype.findItemWithItem = function (item) {
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex > -1; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget.$item !== item && GridsterComponent.checkCollisionTwoItems(widget.$item, item)) {
                return widget;
            }
        }
        return false;
    };
    GridsterComponent.prototype.findItemsWithItem = function (item) {
        var a = [];
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex > -1; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget.$item !== item && GridsterComponent.checkCollisionTwoItems(widget.$item, item)) {
                a.push(widget);
            }
        }
        return a;
    };
    GridsterComponent.prototype.autoPositionItem = function (itemComponent) {
        if (this.getNextPossiblePosition(itemComponent.$item)) {
            itemComponent.item.x = itemComponent.$item.x;
            itemComponent.item.y = itemComponent.$item.y;
            itemComponent.itemChanged();
        }
        else {
            itemComponent.notPlaced = true;
            if (!this.$options.disableWarnings) {
                console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
                    JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
            }
        }
    };
    GridsterComponent.prototype.getNextPossiblePosition = function (newItem, startingFrom) {
        if (startingFrom === void 0) { startingFrom = {}; }
        if (newItem.cols === -1) {
            newItem.cols = this.$options.defaultItemCols;
        }
        if (newItem.rows === -1) {
            newItem.rows = this.$options.defaultItemRows;
        }
        this.setGridDimensions();
        var rowsIndex = startingFrom.rows || 0, colsIndex;
        for (; rowsIndex < this.rows; rowsIndex++) {
            newItem.y = rowsIndex;
            colsIndex = startingFrom.cols || 0;
            for (; colsIndex < this.columns; colsIndex++) {
                newItem.x = colsIndex;
                if (!this.checkCollision(newItem)) {
                    return true;
                }
            }
        }
        var canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
        var canAddToColumns = this.$options.maxCols >= this.columns + newItem.cols;
        var addToRows = this.rows <= this.columns && canAddToRows;
        if (!addToRows && canAddToColumns) {
            newItem.x = this.columns;
            newItem.y = 0;
            return true;
        }
        else if (canAddToRows) {
            newItem.y = this.rows;
            newItem.x = 0;
            return true;
        }
        return false;
    };
    GridsterComponent.prototype.getFirstPossiblePosition = function (item) {
        var tmpItem = Object.assign({}, item);
        this.getNextPossiblePosition(tmpItem);
        return tmpItem;
    };
    GridsterComponent.prototype.getLastPossiblePosition = function (item) {
        var farthestItem;
        farthestItem = this.grid.reduce(function (prev, curr) {
            var currCoords = { y: curr.$item.y + curr.$item.rows - 1, x: curr.$item.x + curr.$item.cols - 1 };
            var cmpResult = gridsterUtils_service_1.GridsterUtils.compareItems({ y: prev.rows, x: prev.cols }, { y: currCoords.y, x: currCoords.x });
            return cmpResult === 1 ? { rows: currCoords.y, cols: currCoords.x, item: curr } : prev;
        }, { rows: 0, cols: 0, item: null });
        var tmpItem = Object.assign({}, item);
        this.getNextPossiblePosition(tmpItem, {
            rows: farthestItem.rows - farthestItem.item.$item.rows + 1,
            cols: farthestItem.cols
        });
        return tmpItem;
    };
    GridsterComponent.prototype.pixelsToPositionX = function (x, roundingMethod) {
        return Math.max(roundingMethod(x / this.curColWidth), 0);
    };
    GridsterComponent.prototype.pixelsToPositionY = function (y, roundingMethod) {
        return Math.max(roundingMethod(y / this.curRowHeight), 0);
    };
    GridsterComponent.prototype.positionXToPixels = function (x) {
        return x * this.curColWidth;
    };
    GridsterComponent.prototype.positionYToPixels = function (y) {
        return y * this.curRowHeight;
    };
    GridsterComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster',
                    template: "<gridster-grid class=\"gridster-grid\"></gridster-grid> <ng-content></ng-content> <gridster-preview class=\"gridster-preview\"></gridster-preview>",
                    styles: ["gridster {   position: relative;   display: flex;   overflow: auto;   flex: 1 auto;   background: grey;   width: 100%;   height: 100%;   user-select: none; }  gridster.fit {   overflow-x: hidden;   overflow-y: hidden; }  gridster.scrollVertical {   overflow-x: hidden;   overflow-y: auto; }  gridster.scrollHorizontal {   overflow-x: auto;   overflow-y: hidden; }  gridster.fixed {   overflow: auto; }  gridster.mobile {   overflow-x: hidden;   overflow-y: auto;   display: block; }  gridster.mobile gridster-item {   position: relative; }"],
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    GridsterComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer2, },
        { type: core_1.ChangeDetectorRef, },
    ]; };
    GridsterComponent.propDecorators = {
        "options": [{ type: core_1.Input },],
    };
    return GridsterComponent;
}());
exports.GridsterComponent = GridsterComponent;
