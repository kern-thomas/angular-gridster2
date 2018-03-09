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
            this.renderer.setStyle(this.el, 'display', null);
        }
        else {
            if (this.gridster.compact && drag) {
                this.gridster.compact.checkCompactItem(this.gridster.movingItem);
            }
            this.renderer.setStyle(this.el, 'display', 'block');
            this.renderer.setStyle(this.el, 'grid-column-start', (this.gridster.movingItem.x + 1));
            this.renderer.setStyle(this.el, 'grid-column-end', ((this.gridster.movingItem.x + 1) + this.gridster.movingItem.cols));
            this.renderer.setStyle(this.el, 'grid-row-start', (this.gridster.movingItem.y + 1));
            this.renderer.setStyle(this.el, 'grid-row-end', ((this.gridster.movingItem.y + 1) + this.gridster.movingItem.rows));
        }
    };
    GridsterPreviewComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'gridster-preview',
                    template: '',
                    styles: ["gridster-preview {   display: none;   background: rgba(0, 0, 0, 0.15); }"],
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
