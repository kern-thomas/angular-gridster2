"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var GridsterPreviewComponent = /** @class */ (function () {
    function GridsterPreviewComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.previewStyle = this.previewStyle.bind(this);
    }
    GridsterPreviewComponent.prototype.ngOnDestroy = function () {
        delete this.el;
        delete this.gridster.previewStyle;
        delete this.gridster;
    };
    GridsterPreviewComponent.prototype.previewStyle = function (drag) {
        if (!this.gridster.movingItem) {
            this.renderer.setStyle(this.el, 'display', 'none');
        }
        else {
            if (this.gridster.compact && drag) {
                this.gridster.compact.checkCompactItem(this.gridster.movingItem);
            }
            var margin = void 0;
            var curRowHeight = this.gridster.curRowHeight;
            var curColWidth = this.gridster.curColWidth;
            if (this.gridster.$options.outerMargin) {
                if (this.gridster.$options.outerMarginTop !== null) {
                    margin = this.gridster.$options.outerMarginTop + 'px ';
                }
                else {
                    margin = this.gridster.$options.margin + 'px ';
                }
                if (this.gridster.$options.outerMarginRight !== null) {
                    margin += this.gridster.$options.outerMarginRight + 'px ';
                }
                else {
                    margin += this.gridster.$options.margin + 'px ';
                }
                if (this.gridster.$options.outerMarginBottom !== null) {
                    margin += this.gridster.$options.outerMarginBottom + 'px ';
                }
                else {
                    margin += this.gridster.$options.margin + 'px ';
                }
                if (this.gridster.$options.outerMarginLeft !== null) {
                    margin += this.gridster.$options.outerMarginLeft + 'px';
                }
                else {
                    margin += this.gridster.$options.margin + 'px';
                }
            }
            else {
                margin = 0 + 'px';
            }
            this.renderer.setStyle(this.el, 'display', 'block');
            this.renderer.setStyle(this.el, 'height', (this.gridster.movingItem.rows * curRowHeight - this.gridster.$options.margin) + 'px');
            this.renderer.setStyle(this.el, 'width', (this.gridster.movingItem.cols * curColWidth - this.gridster.$options.margin) + 'px');
            this.renderer.setStyle(this.el, 'top', (this.gridster.movingItem.y * curRowHeight) + 'px');
            this.renderer.setStyle(this.el, 'left', (this.gridster.movingItem.x * curColWidth) + 'px');
            this.renderer.setStyle(this.el, 'margin', margin);
        }
    };
    GridsterPreviewComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster-preview',
                    template: '',
                    styles: ["gridster-preview {   background: rgba(0, 0, 0, 0.15);   position: absolute; }"],
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    GridsterPreviewComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
        { type: core_1.Renderer2, },
    ]; };
    return GridsterPreviewComponent;
}());
exports.GridsterPreviewComponent = GridsterPreviewComponent;
