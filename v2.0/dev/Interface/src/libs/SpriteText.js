(function (a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b(require("three"), require("three.texttexture")) : "function" == typeof define && define.amd ? define(["three", "three.texttexture"], b) : (a.THREE = a.THREE || {}, a.THREE.TextSprite = b(a.THREE, a.THREE.TextTexture))
})(this, function (a, b) {
    "use strict";

    function c(a, b, c) {
        var g = Math.round;
        if (b.domElement.width && b.domElement.height && a.material.map.textLines.length) {
            var h = a.getWorldPosition(d).distanceTo(c.getWorldPosition(e));
            if (h) {
                var i = a.getWorldScale(f).y * b.domElement.height / h;
                if (i) return g(i / a.material.map.imageHeight)
            }
        }
        return 0
    }
    b = b && b.hasOwnProperty("default") ? b["default"] : b;
    var d = new a.Vector3,
        e = new a.Vector3,
        f = new a.Vector3,
        g = function (d) {
            function e(c) {
                void 0 === c && (c = {});
                var e = c.textSize;
                void 0 === e && (e = 1);
                var f = c.redrawInterval;
                void 0 === f && (f = 1);
                var g = c.minFontSize;
                void 0 === g && (g = 0);
                var h = c.maxFontSize;
                void 0 === h && (h = 1 / 0);
                var i = c.material;
                void 0 === i && (i = {});
                var j = c.texture;
                void 0 === j && (j = {}), d.call(this, new a.SpriteMaterial(Object.assign({}, i, {
                    map: new b(j)
                }))), this.textSize = e, this.redrawInterval = f, this.minFontSize = g, this.maxFontSize = h, this.lastRedraw = 0
            }
            d && (e.__proto__ = d), e.prototype = Object.create(d && d.prototype), e.prototype.constructor = e;
            var f = {
                isTextSprite: {
                    configurable: !0
                }
            };
            return f.isTextSprite.get = function () {
                return !0
            }, e.prototype.onBeforeRender = function (a, b, c) {
                this.redraw(a, c)
            }, e.prototype.updateScale = function () {
                this.scale.set(this.material.map.imageAspect, 1, 1).multiplyScalar(this.textSize * this.material.map.imageHeight)
            }, e.prototype.updateMatrix = function () {
                for (var a = [], b = arguments.length; b--;) a[b] = arguments[b];
                return this.updateScale(), d.prototype.updateMatrix.apply(this, a)
            }, e.prototype.redraw = function (a, b) {
                var c = this;
                this.lastRedraw + this.redrawInterval < Date.now() && (this.redrawInterval ? setTimeout(function () {
                    c.redrawNow(a, b)
                }, 1) : this.redrawNow(a, b))
            }, e.prototype.redrawNow = function (b, d) {
                this.updateScale(), this.material.map.autoRedraw = !0, this.material.map.fontSize = a.Math.clamp(a.Math.ceilPowerOfTwo(c(this, b, d)), this.minFontSize, this.maxFontSize), this.lastRedraw = Date.now()
            }, e.prototype.dispose = function () {
                this.material.map.dispose(), this.material.dispose()
            }, Object.defineProperties(e.prototype, f), e
        }(a.Sprite);
    return g
});