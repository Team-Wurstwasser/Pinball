function isWebGLAvailable() {
    if (window.WebGLRenderingContext) {
        for (var e = document.createElement("canvas"), t = ["webgl2", "webgl", "experimental-webgl", "moz-webgl", "webkit-3d"], n = !1, r = 0; r < t.length; r++)
            try {
                if ((n = e.getContext(t[r])) && "function" == typeof n.getParameter)
                    return !0
            } catch (e) {}
        return !1
    }
    return !1
}