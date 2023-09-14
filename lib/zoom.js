"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const docusaurus_config_1 = tslib_1.__importDefault(require("@generated/docusaurus.config"));
const medium_zoom_1 = tslib_1.__importDefault(require("medium-zoom"));
const { themeConfig } = docusaurus_config_1.default;
function getBackgroundColor(zoom) {
    var _a, _b;
    const isDarkMode = document.querySelector('html[data-theme="dark"]');
    return isDarkMode
        ? ((_a = zoom.background) === null || _a === void 0 ? void 0 : _a.dark) || 'rgb(50, 50, 50)'
        : ((_b = zoom.background) === null || _b === void 0 ? void 0 : _b.light) || 'rgb(255, 255, 255)';
}
exports.default = (function () {
    if (typeof window === 'undefined') {
        return null;
    }
    let zoomObject;
    const { zoom } = themeConfig;
    const { selector = '.markdown img', config = {} } = zoom || {};
    if (!zoom) {
        return null;
    }
    const observer = new MutationObserver(() => {
        const background = getBackgroundColor(zoom);
        config['background'] = background;
        if (zoomObject) {
            zoomObject.update({ background });
        }
    });
    const htmlNode = document.querySelector('html');
    observer.observe(htmlNode, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    const resizeObserver = new ResizeObserver(entries => {
        var _a;
        for (let entry of entries) {
            if (entry.contentRect.width < 1000) {
                zoomObject.update({ margin: config ? 6 : 0 });
            }
            else {
                zoomObject.update({ margin: (_a = config['margin']) !== null && _a !== void 0 ? _a : 0 });
            }
        }
    });
    resizeObserver.observe(htmlNode);
    setTimeout(() => {
        if (zoomObject) {
            zoomObject.detach();
        }
        zoomObject = (0, medium_zoom_1.default)(selector, config);
    }, 1000);
    return {
        onRouteUpdate() {
            setTimeout(() => {
                if (zoomObject) {
                    zoomObject.detach();
                }
                zoomObject = (0, medium_zoom_1.default)(selector, config);
            }, 1000);
        }
    };
})();
//# sourceMappingURL=zoom.js.map