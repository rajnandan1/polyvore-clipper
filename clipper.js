(function() {
    var Conf = function() {
        var modes = {
            dev: {
                cookieDomain: ".polyvore.net",
                oldImgHost: "www.polyvore.net",
                imgHosts: ["img1.polyvore.net", "img2.polyvore.net"],
                httpsImgHost: "www.polyvore.net",
                cdnImgHosts: {},
                blogUrl: "https://web.archive.org/web/20160101070529/http://blog.polyvore.com/",
                fbApiKey: "e006261993081197d9a617cbb0b6e7b6",
                isStaging: true,
                appEffectsCategories: [327, 329, 330, 331]
            },
            snapshot: {
                cookieDomain: ".polyvore.net",
                oldImgHost: "www.polyvore.com",
                imgHosts: ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
                httpsImgHost: "www.polyvore.com",
                cdnImgHosts: {
                    akamai: ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
                },
                httpsCdnImgHost: "www.polyvore.com",
                rewriteImgBase: true,
                blogUrl: "https://web.archive.org/web/20160101070529/http://blog.polyvore.com/",
                fbApiKey: "e006261993081197d9a617cbb0b6e7b6",
                isStaging: true,
                appEffectsCategories: [327, 329, 330, 331]
            },
            testenv: (function() {
                var devName = window._polyvoreDevName;
                var imgHost = "testenv." + devName + ".polyvore.net";
                return {
                    cookieDomain: ".polyvore.net",
                    oldImgHost: imgHost,
                    imgHosts: [imgHost],
                    httpsImgHost: imgHost,
                    cdnImgHosts: {},
                    blogUrl: "https://web.archive.org/web/20160101070529/http://blog.polyvore.com/",
                    fbApiKey: "e006261993081197d9a617cbb0b6e7b6",
                    isStaging: true
                }
            })(),
            live: {
                cookieDomain: ".polyvore.net",
                oldImgHost: "www.polyvore.com",
                imgHosts: ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
                httpsImgHost: "www.polyvore.com",
                cdnImgHosts: {
                    akamai: ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
                },
                httpsCdnImgHost: "www.polyvore.com",
                rewriteImgBase: true,
                blogUrl: "https://web.archive.org/web/20160101070529/http://blog.polyvore.com/",
                fbApiKey: "e006261993081197d9a617cbb0b6e7b6",
                isStaging: true,
                appEffectsCategories: [327, 329, 330, 331]
            },
            prod: {
                webHost: "www.polyvore.com",
                cookieDomain: ".polyvore.com",
                oldImgHost: "www.polyvore.com",
                imgHosts: ["img1.polyvoreimg.com", "img2.polyvoreimg.com"],
                httpsImgHost: "www.polyvore.com",
                cdnImgHosts: {
                    akamai: ["ak1.polyvoreimg.com", "ak2.polyvoreimg.com"]
                },
                httpsCdnImgHost: "www.polyvore.com",
                rsrcUrlPrefix: {
                    akamai: "https://web.archive.org/web/20160101070529/http://akwww.polyvorecdn.com/rsrc/"
                },
                httpsRsrcUrlPrefix: "https://web.archive.org/web/20160101070529/https://www.polyvore.com/rsrc/",
                rsrcExtUrlPrefix: "https://web.archive.org/web/20160101070529/http://ext.polyvorecdn.com/rsrc/",
                noCachePrefix: "https://web.archive.org/web/20160101070529/http://rsrc.polyvore.com/rsrc/",
                blogUrl: "https://web.archive.org/web/20160101070529/http://blog.polyvore.com/",
                fbApiKey: "3d1d18f72a710e20514cd62955686c8f",
                isStaging: false,
                appEffectsCategories: [327, 329, 330, 331]
            }
        };
        var _modeName = window.polyvore_mode || window._polyvoreMode || "prod";
        var _mode = modes[_modeName];
        var _locale = null;
        if (window._polyvoreLocale && window._polyvoreLocale != "en") {
            _locale = window._polyvoreLocale
        }
        var _baseURL = "";
        try {
            var scripts = document.getElementsByTagName("script");
            for (var i = scripts.length - 1; i >= 0; i--) {
                var script = scripts[i];
                var src = script.src.toString();
                if (src && !/^(([a-z]+):\/\/)/.test(src)) {
                    var el = document.createElement("div");
                    src = src.replace('"', "%22");
                    el.innerHTML = '<a href="' + src + '" style="display:none">x</a>';
                    src = el.firstChild.href
                }
                if (src && /polyvore(cdn)?.(com|net|dev)/.test(src.match(/\/\/([^\/]*)/)[1])) {
                    _baseURL = src.replace(/.*https?:\/\/[^\/]*\//, "/").replace(/(\/[^\/]*){2,2}$/, "");
                    break
                }
            }
        } catch (ignore) {}
        var _rsrcUrlPrefix;

        function hashImgParams(action, params) {
            var serialized = [action];
            var sortedKeys = [];
            forEachKey(params, function(key) {
                sortedKeys.push(key)
            });
            sortedKeys.sort();
            sortedKeys.forEach(function(key) {
                serialized.push(params[key])
            });
            var hash = 0;
            serialized = serialized.join("");
            for (var i = 0, len = serialized.length; i < len; i++) {
                hash += serialized.charCodeAt(i)
            }
            return hash
        }
        return {
            getDevName: function() {
                return window._polyvoreDevName
            },
            getFbApiKey: function() {
                return _mode.fbApiKey
            },
            getCookieDomain: function() {
                return _mode.cookieDomain
            },
            getWebHost: function() {
                return _mode.webHost || window._polyvoreHost || "www.polyvore.net"
            },
            getWebUrlPrefix: function() {
                return Conf.getWebHost() + _baseURL
            },
            getImgHost: function(action, params) {
                if (getProtocol() == "https") {
                    return _mode.httpsImgHost
                }
                if (!params) {
                    params = {}
                }
                if (params.size == "x" || params.size == "l" || params.size == "e") {
                    return _mode.oldImgHost
                } else {
                    var hash = hashImgParams(action, params);
                    return _mode.imgHosts[hash % _mode.imgHosts.length]
                }
            },
            getCDNImgHost: function(cdn, action, params) {
                if (getProtocol() == "https") {
                    return _mode.httpsCdnImgHost
                }
                var hosts = _mode.cdnImgHosts[cdn];
                if (!hosts) {
                    return ""
                }
                var hash = hashImgParams(action, params);
                return hosts[hash % hosts.length]
            },
            getRsrcUrlPrefix: function(cdn, ext) {
                if (_rsrcUrlPrefix) {
                    return _rsrcUrlPrefix
                }
                if (getProtocol() == "https") {
                    _rsrcUrlPrefix = _mode.httpsRsrcUrlPrefix;
                    return _mode.httpsRsrcUrlPrefix
                }
                if (ext) {
                    _rsrcUrlPrefix = _mode.rsrcExtUrlPrefix
                } else {
                    if (_mode.rsrcUrlPrefix) {
                        _rsrcUrlPrefix = _mode.rsrcUrlPrefix[cdn]
                    }
                }
                if (!_rsrcUrlPrefix) {
                    _rsrcUrlPrefix = "http://" + Conf.getWebUrlPrefix() + "/rsrc/"
                }
                return _rsrcUrlPrefix
            },
            getNoCachePrefix: function() {
                return _mode.noCachePrefix ? _mode.noCachePrefix : "http://" + Conf.getWebUrlPrefix() + "/rsrc/"
            },
            getBlogURL: function() {
                return _mode.blogUrl
            },
            isStaging: function() {
                return _mode.isStaging
            },
            setLocale: function(locale) {
                _locale = locale
            },
            getLocale: function() {
                return _locale
            },
            getModeName: function() {
                return _modeName
            },
            getSetting: function(name) {
                return _mode[name]
            }
        }
    }();
    var BrowserDetect = {
        init: function() {
            this.browserInfo = this.searchInfo(this.dataBrowser) || null;
            this.browser = this.browserInfo ? this.browserInfo.identity : "An unknown browser";
            this.version = document.documentMode || this.searchVersion(navigator.userAgent, this.browserInfo) || this.searchVersion(navigator.appVersion, this.browserInfo) || "an unknown version";
            this.OSInfo = this.searchInfo(this.dataOS) || null;
            this.OS = this.OSInfo ? this.OSInfo.identity : "an unknown OS";
            this.layoutEngineInfo = this.searchInfo(this.dataLayoutEngine) || null;
            this.layoutEngine = this.layoutEngineInfo ? this.layoutEngineInfo.identity : "an unknown layout engine";
            this.layoutEngineVersion = this.searchVersion(navigator.userAgent, this.layoutEngineInfo) || this.searchVersion(navigator.appVersion) || "an unknown layout engine version"
        },
        searchInfo: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) {
                        return data[i]
                    }
                } else {
                    if (dataProp) {
                        return data[i]
                    }
                }
            }
            return false
        },
        searchVersion: function(dataString, browserInfo) {
            var versionSearchString = browserInfo ? browserInfo.versionSearch || browserInfo.identity : "";
            var index = dataString.indexOf(versionSearchString);
            if (index == -1) {
                return false
            }
            return parseFloat(dataString.substring(index + versionSearchString.length + 1))
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Polyvore",
            identity: "Polyvore"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "IE",
            versionSearch: "MSIE",
            upgradeURL: "https://web.archive.org/web/20160101070529/http://www.microsoft.com/windows/Internet-explorer/default.aspx"
        }, {
            string: navigator.userAgent,
            subString: "Trident",
            identity: "IE",
            versionSearch: "rv",
            upgradeURL: "https://web.archive.org/web/20160101070529/http://www.microsoft.com/windows/Internet-explorer/default.aspx"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox",
            upgradeURL: "https://web.archive.org/web/20160101070529/http://www.getfirefox.com/"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            upgradeURL: "https://web.archive.org/web/20160101070529/http://www.apple.com/safari/download/"
        }, {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome",
            upgradeURL: "https://web.archive.org/web/20160101070529/http://www.google.com/chrome"
        }, {
            prop: window.opera,
            identity: "Opera"
        }, {
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "iPad",
            identity: "iPad"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }, {
            string: navigator.platform,
            subString: "iPhone",
            identity: "iPhone"
        }, {
            string: navigator.platform,
            subString: "iPod",
            identity: "iPod"
        }],
        dataLayoutEngine: [{
            string: navigator.userAgent,
            subString: "AppleWebKit",
            identity: "WebKit"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Gecko",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Presto",
            identity: "Presto"
        }]
    };
    BrowserDetect.init();
    var Browser = function() {
        var isAndroid4 = false;
        if (BrowserDetect.OS === "Linux") {
            var userAgent = BrowserDetect.browserInfo.string;
            var matches = userAgent.match(/Android ([\d]+)[.\d]*;/) || [];
            var majorVersion = parseInt(matches[1], 10);
            if (matches.length && majorVersion >= 4) {
                isAndroid4 = true
            }
        }
        return {
            isIE: "IE" == BrowserDetect.browser,
            isSafari: "Safari" == BrowserDetect.browser,
            isChrome: "Chrome" == BrowserDetect.browser,
            isOpera: "Opera" == BrowserDetect.browser,
            isMac: "Mac" == BrowserDetect.OS,
            isIPad: "iPad" == BrowserDetect.OS,
            isIPhone: "iPhone" == BrowserDetect.OS,
            isIPod: "iPod" == BrowserDetect.OS,
            isIPhoneOrIPod: "iPhone" == BrowserDetect.OS || "iPod" == BrowserDetect.OS,
            isAndroid4: isAndroid4,
            isWindows: "Windows" == BrowserDetect.OS,
            isFirefox: "Firefox" == BrowserDetect.browser,
            isMozilla: "Mozilla" == BrowserDetect.browser,
            isPolyvoreNativeApp: "Polyvore" == BrowserDetect.browser,
            type: function(t, minV, maxV) {
                return t == BrowserDetect.browser && (!minV || minV <= BrowserDetect.version) && (!maxV || maxV >= BrowserDetect.version)
            },
            layoutEngine: function(t, minV, maxV) {
                return t == BrowserDetect.layoutEngine && (!minV || minV <= BrowserDetect.layoutEngineVersion) && (!maxV || maxV >= BrowserDetect.layoutEngineVersion)
            }
        }
    }();
    var JSON2;
    if (!JSON2) {
        JSON2 = {}
    }(function() {
        function f(n) {
            return n < 10 ? "0" + n : n
        }
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = function(key) {
            return this.valueOf()
        };
        Boolean.prototype.toJSON = function(key) {
            return this.valueOf() ? 1 : 0
        };
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;

        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + string + '"'
        }

        function str(key, holder) {
            var i, k, v, length, mind = gap,
                partial, value = holder[key];
            if (typeof rep === "function") {
                value = rep.call(holder, key, value)
            }
            switch (typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                    return value ? 1 : 0;
                case "null":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null"
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null"
                        }
                        v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v
                    }
                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === "string") {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v
            }
        }
        if (typeof JSON2.stringify !== "function") {
            JSON2.stringify = function(value, replacer, space) {
                var i;
                gap = "";
                indent = "";
                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " "
                    }
                } else {
                    if (typeof space === "string") {
                        indent = space
                    }
                }
                rep = replacer;
                if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify")
                }
                return str("", {
                    "": value
                })
            }
        }
        if (typeof JSON2.parse !== "function") {
            JSON2.parse = function(text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v
                                } else {
                                    delete value[k]
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value)
                }
                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function(a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    })
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    j = eval("(" + text + ")");
                    return typeof reviver === "function" ? walk({
                        "": j
                    }, "") : j
                }
                throw new SyntaxError("JSON.parse")
            }
        }
    }());

    function Set() {
        this.items = {};
        this._size = 0
    }
    Set.prototype.size = function() {
        return this._size
    };
    Set.prototype.forEach = function(method, obj) {
        this.values().forEach(method, obj)
    };
    Set.prototype.ncp = function(value) {
        if (this.contains(value)) {
            return false
        }
        this.put(value);
        return true
    };
    Set.prototype.contains = function(value) {
        var key = getHashKey(value);
        if (this.items[":" + key]) {
            return true
        } else {
            return false
        }
    };
    Set.prototype.get = function(data) {
        if (this.contains(data)) {
            return this.items[":" + getHashKey(data)]
        } else {
            return null
        }
    };
    Set.prototype.put = function(value) {
        var key = getHashKey(value);
        if (!this.items[":" + key]) {
            this.items[":" + key] = value;
            delete this._values;
            this._size++
        }
    };
    Set.prototype.remove = function(value) {
        var key = getHashKey(value);
        if (this.items[":" + key]) {
            delete this.items[":" + key];
            delete this._values;
            this._size--;
            return true
        }
        return false
    };
    Set.prototype.clear = function() {
        this.items = {};
        delete this._values;
        this._size = 0
    };
    Set.prototype.values = function() {
        if (this._values) {
            return this._values
        }
        var result = [];
        for (var key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                result.push(this.items[key])
            }
        }
        return (this._values = result)
    };
    Set.showAnimationToggle = function(option) {
        if (Set.isAnimationShown(option)) {
            return
        }
        addClass($("top"), "set_animate");
        if (option.localStorageName) {
            var localStorageValue = window.localStorage.getItem(option.localStorageName) || 0;
            localStorageValue = parseInt(localStorageValue, 10) + 1;
            window.localStorage.setItem(option.localStorageName, localStorageValue)
        }
        var items = [$("top")];
        items.forEach(function(item) {
            Event.addListener(item, "click", function() {
                addClass($("top"), "set_animate_back");
                var swingTag = document.getElementsByClassName("thing_tag")[0];
                removeClass(swingTag, "set_animate")
            })
        })
    };
    Set.isAnimationShown = function(option) {
        var maxCount = option.maxCount || 3;
        var count = 0;
        if (option.localStorageName) {
            count = window.localStorage.getItem(option.localStorageName);
            return count >= maxCount
        }
    };
    Set.togglePostCommentButton = function(btn, textArea) {
        btn = $(btn);
        if (btn) {
            Event.addListener(window, "click", function(e) {
                if (hasClass(textArea, "input_hint")) {
                    btn.style.display = "none"
                }
            }, this)
        }
        textArea = $(textArea);
        if (textArea) {
            Event.addListener(textArea, "focus", function(e) {
                btn.style.display = "inline"
            }, this)
        }
    };
    Set.showSwingTags = function(image_id, tag, options) {
        var imageNode = $(image_id);
        var container = imageNode.parentNode;
        var node = createNode("div", {
            className: "thing_tag"
        }, {
            top: px(Math.max(tag.y - 2, 0) + tag.h * 0.3),
            left: px(Math.max(tag.x - 2, 0) + tag.w * 0.3)
        }, createNode("div", {
            className: "thing_tag_text"
        }, null, loc(tag.tag)));
        container.appendChild(node);
        if (options.is_user_logged_in) {
            setTimeout(function() {
                addClass(node, "fadeout")
            }, 7500)
        } else {
            if (!Set.isAnimationShown(options)) {
                setTimeout(function() {
                    addClass(node, "set_animate")
                }, 3000);
                if (options.localStorageName) {
                    var localStorageValue = window.localStorage.getItem(options.localStorageName) || 0;
                    localStorageValue = parseInt(localStorageValue, 10) + 1;
                    window.localStorage.setItem(options.localStorageName, localStorageValue)
                }
            }
        }
    };
    var getUID;
    (function() {
        var UID = 1;
        getUID = function(value) {
            var type = typeof(value);
            var key;
            if (type == "object" || type == "function") {
                key = value._uid;
                if (!key) {
                    key = UID++;
                    try {
                        value._uid = key
                    } catch (ignore) {}
                }
            } else {
                key = value
            }
            return key
        }
    })();

    function getHashKey(value) {
        switch (typeof(value)) {
            case "number":
            case "string":
                return value;
            case "boolean":
                return value ? 1 : 0;
            case "object":
                if (!value) {
                    return value
                }
                var key;
                if (value.getHashKey && typeof(value.getHashKey) == "function") {
                    return value.getHashKey()
                } else {
                    key = getUID(value)
                }
                return key;
            default:
                return value
        }
    }

    function compare(a, b) {
        var typea = typeof(a);
        var typeb = typeof(b);
        if (typea != typeb) {
            return false
        }
        switch (typea) {
            case "number":
            case "string":
            case "boolean":
                return a === b;
            default:
                return getHashKey(a) === getHashKey(b)
        }
    }

    function Hash() {
        this.items = {}
    }
    Hash._key = function(key) {
        return ":" + getHashKey(key)
    };
    Hash.prototype.merge = function(obj) {
        for (var property in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                this.put(property, obj[property])
            }
        }
    };
    Hash.prototype.put = function(key, value) {
        var rval;
        if (this.contains(key)) {
            rval = this.get(key)
        }
        this.items[Hash._key(key)] = value;
        return rval
    };
    Hash.prototype.get = function(key) {
        return this.items[Hash._key(key)]
    };
    Hash.prototype.remove = function(key) {
        key = Hash._key(key);
        if (this.items[key]) {
            delete this.items[key]
        }
    };
    Hash.prototype.clear = function() {
        this.items = {}
    };
    Hash.prototype.contains = function(key) {
        return this.items.hasOwnProperty([Hash._key(key)])
    };

    function Interval(interval, method, obj) {
        this.timerId = 0;
        this.interval = interval;
        this.f = Event.wrapper(function() {
            try {
                method.apply(obj)
            } catch (e) {
                console.log(e)
            }
            if (this.timerId !== undefined) {
                this.reschedule()
            }
        }, this);
        this.reschedule()
    }
    Interval.prototype.clear = function() {
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            delete this.timerId
        }
    };
    Interval.prototype.reschedule = function(ts) {
        this.clear();
        this.interval = ts || this.interval;
        this.timerId = window.setTimeout(this.f, this.interval)
    };

    function Cleaner() {
        var actions = [];
        return {
            push: function(item) {
                if (item) {
                    actions.push(item)
                }
            },
            clean: function() {
                actions.forEach(function(item) {
                    if (item.clean && typeof(item.clean) == "function") {
                        item.clean()
                    } else {
                        if (typeof(item) == "function") {
                            item.call()
                        }
                    }
                });
                actions = []
            }
        }
    }

    function EventMap() {
        this.events = {}
    }
    EventMap.prototype.getOrInitEventObjects = function(source, event) {
        var sourceId = getUID(source);
        if (source && source.getAttribute && !source.getAttribute("_uid")) {
            source.setAttribute("_uid", sourceId)
        }
        if (!this.events[sourceId]) {
            this.events[sourceId] = {}
        }
        if (!this.events[sourceId][event]) {
            this.events[sourceId][event] = {}
        }
        if (!this.events[sourceId][event].listeners) {
            this.events[sourceId][event].listeners = []
        }
        return this.events[sourceId][event]
    };
    EventMap.prototype.getListenedEvent = function(source, event) {
        var sourceId = getUID(source);
        return this.events[sourceId] && this.events[sourceId][event]
    };
    EventMap.prototype.getPVListeners = function(source, event) {
        var sourceId = getUID(source);
        return this.getListenedEvent(source, event) && this.events[sourceId][event].listeners
    };
    EventMap.prototype.release = function(source) {
        var sourceId = getUID(source);
        return this.releaseId(sourceId, source)
    };
    EventMap.prototype.releaseAll = function(onRelease) {
        if (!document.querySelectorAll) {
            console.log("ReleaseAll not supported by this browser");
            return
        }
        var sources = document.querySelectorAll("[_uid]");
        sources = nodeListToArray(sources);
        sources.push(window);
        sources.push(document);
        sources.forEach(function(source) {
            var sourceId = source._uid;
            if (sourceId) {
                this.releaseId(sourceId, source);
                if (onRelease) {
                    onRelease(sourceId, source)
                }
            }
        }, this);
        this.getSourceIDs().forEach(function(sourceId) {
            this.releaseId(sourceId)
        }, this)
    };
    EventMap.prototype.releaseId = function(sourceId, source) {
        if (!this.events[sourceId]) {
            return
        }
        for (var event in this.events[sourceId]) {
            if (!this.events[sourceId].hasOwnProperty(event)) {
                continue
            }
            var scrollBottomDetector = this.events[sourceId][event].scrollBottomDetector;
            if (scrollBottomDetector) {
                scrollBottomDetector.clear()
            }
            var listeners = this.events[sourceId][event].listeners;
            if (listeners.constructor != Array) {
                continue
            }
            if (source) {
                for (var i = 0; i < listeners.length; ++i) {
                    if (Event.isBuiltIn(source, event)) {
                        Event.removeDomListener(source, event, listeners[i])
                    }
                }
            }
            delete this.events[sourceId][event]
        }
        delete this.events[sourceId]
    };
    EventMap.prototype.getSourceIDs = function() {
        var keys = [];
        forEachKey(this.events, function(sourceId) {
            keys.push(sourceId)
        });
        return keys
    };

    function Listener(src, event, handler) {
        this.src = src;
        this.event = event;
        this.handler = handler
    }
    Listener.prototype.clean = function() {
        var event = this.event;
        var src = this.src;
        if (this.src && this.event) {
            Event.removeListener(src, event, this.handler)
        }
        this.src = this.event = this.handler = null
    };
    var Event = function() {
        var WRAPPERS = {};
        var BUILTINS = {
            filterchange: true,
            abort: true,
            blur: true,
            change: true,
            click: true,
            contextmenu: true,
            dblclick: true,
            error: true,
            focus: true,
            keydown: true,
            keypress: true,
            transitionend: true,
            webkitTransitionEnd: true,
            webkitAnimationEnd: true,
            keyup: true,
            load: true,
            message: true,
            mousedown: true,
            mousemove: true,
            mouseover: true,
            mouseout: true,
            mouseup: true,
            reset: true,
            resize: true,
            scroll: true,
            select: true,
            selectstart: true,
            submit: true,
            unload: true,
            beforeunload: true,
            copy: true,
            DOMMouseScroll: true,
            mousewheel: true,
            DOMContentLoaded: true,
            touchstart: true,
            touchmove: true,
            touchend: true,
            touchcancel: true,
            pageshow: true,
            pagehide: true,
            popstate: true,
            orientationchange: true,
            paste: true,
            input: true
        };
        var eventMap = new EventMap();
        var bubbleMap = {};
        var messageListener;
        var lastMsgTimeStamp = 0;
        var startHistoryLength = window.history.length - 1;
        var baseTime = new Date().getTime();
        var fireOnceHash = new Hash();
        return {
            getPageXY: function(event, tmp) {
                var x = event.pageX;
                tmp = tmp ? tmp : new Point(0, 0);
                if (!x && 0 !== x) {
                    x = event.clientX || 0
                }
                var y = event.pageY;
                if (!y && 0 !== y) {
                    y = event.clientY || 0
                }
                if (Browser.isIE) {
                    var scroll = scrollXY();
                    tmp.x = x + scroll.x;
                    tmp.y = y + scroll.y
                } else {
                    tmp.x = x;
                    tmp.y = y
                }
                return tmp
            },
            getChar: function(event) {
                if (!event) {
                    return ""
                }
                return String.fromCharCode(event.charCode || event.keyCode)
            },
            addDomListener: function(source, event, wrapper) {
                if (event == "dblclick" && Browser.isSafari) {
                    source.ondblclick = wrapper
                } else {
                    if (source.addEventListener) {
                        source.addEventListener(event, wrapper, false)
                    } else {
                        if (source.attachEvent) {
                            source.attachEvent("on" + event, wrapper)
                        } else {
                            source["on" + event] = wrapper
                        }
                    }
                }
            },
            removeDomListener: function(source, event, wrapper) {
                if (source.removeEventListener) {
                    source.removeEventListener(event, wrapper, false)
                } else {
                    if (source.detachEvent) {
                        source.detachEvent("on" + event, wrapper)
                    } else {
                        source["on" + event] = null
                    }
                }
            },
            postMessage: function(tgt, base, event, message) {
                if (!tgt) {
                    tgt = window.parent
                }
                if (!tgt) {
                    return
                }
                try {
                    if (tgt.contentWindow) {
                        tgt = tgt.contentWindow
                    }
                } catch (el) {}
                tgt.postMessage(JSON2.stringify({
                    event: event,
                    message: message
                }), base)
            },
            addListener: function(source, event, listener, object) {
                if (!source || !event) {
                    var jslint = window._Debug && window._Debug.logStackTrace();
                    console.log("ERROR: addListener called on invalid source or event:", source, event);
                    return
                }
                if (Browser.layoutEngine("WebKit") && event == "transitionend") {
                    event = "webkitTransitionEnd"
                }
                var wrapper;
                var fireOnce = Event.FIREONCE.get(source, event);
                if (fireOnce !== undefined) {
                    if (fireOnce) {
                        window.setTimeout(function() {
                            listener.apply(object)
                        });
                        return null
                    } else {
                        wrapper = function() {
                            Event.removeListener(source, event, wrapper);
                            listener.apply(object)
                        }
                    }
                }
                if (event == "scrollbottom") {
                    var eventObject = eventMap.getOrInitEventObjects(source, event);
                    if (!eventObject.scrollBottomDetector) {
                        eventObject.scrollBottomDetector = new ScrollBottomDetector(source)
                    }
                    if (!eventObject.scrollBottomDetector.isAttached()) {
                        eventObject.scrollBottomDetector.attach(source)
                    }
                    if (eventObject.scrollBottomDetector.isAtBottom()) {
                        yield(listener, object)
                    }
                } else {
                    if (event == "mousewheel" && Browser.isFirefox) {
                        event = "DOMMouseScroll"
                    }
                }
                if (source.tagName == "INPUT" && source.type) {
                    var inputType = source.type.toUpperCase();
                    if ((inputType == "CHECKBOX" || inputType == "RADIO") && event == "change" && Browser.isIE) {
                        event = "click";
                        wrapper = function() {
                            window.setTimeout(function() {
                                listener.apply(object)
                            }, 0)
                        }
                    }
                }
                if (!wrapper) {
                    wrapper = Event.wrapper(listener, object)
                }
                if (/mousepause([0-9]*)$/.test(event)) {
                    var timer = new Timer();
                    var delay = Number(RegExp.$1);
                    if (isNaN(delay) || (!delay && delay !== 0)) {
                        delay = 500
                    }
                    Event.addListener(source, "mousemove", function(e) {
                        timer.replace(wrapper, delay)
                    });
                    Event.addListener(source, "mouseout", timer.reset, timer)
                }
                switch (event) {
                    case "dragstart":
                        Event.addListener(source, "mousedown", DragDrop.onMouseDown, DragDrop);
                        Event.addDomListener(source, "dragstart", Event.stop);
                        break;
                    case "drop":
                        DragDrop.addDropListener(source);
                        break;
                    default:
                        if (source == Event.XFRAME) {
                            if (!messageListener) {
                                messageListener = Event.addListener(window, "message", function(event) {
                                    try {
                                        var data = eval("(" + event.data + ")");
                                        if (data.event) {
                                            Event.trigger(Event.XFRAME, data.event, data.message)
                                        }
                                    } catch (e) {}
                                })
                            }
                        } else {
                            if (source == Event.BACKEND) {
                                if (!Event.BACKEND.listening) {
                                    Event.addListener(Cookie, "change", Event.checkForBackendEvent);
                                    Event.BACKEND.listening = true
                                }
                            } else {
                                if (Event.isBuiltIn(source, event)) {
                                    Event.addDomListener(source, event, wrapper)
                                }
                            }
                        }
                }
                var listeners = eventMap.getOrInitEventObjects(source, event).listeners;
                listeners.push(wrapper);
                return new Listener(source, event, wrapper)
            },
            addSingleUseListener: function(source, event, listener, object) {
                var listenerRemover = function() {
                    var tmp = listener;
                    listener = null;
                    Event.removeListener(source, event, listenerRemover);
                    if (tmp) {
                        tmp.apply(this, arguments)
                    }
                };
                return Event.addListener(source, event, listenerRemover, object)
            },
            removeListener: window._Debug ? function(source, event, method, object) {
                var cacheKey = getUID(method) + ":" + getUID(object);
                var wrappers = WRAPPERS[cacheKey] || [];
                wrappers.forEach(function(wrapper) {
                    Event._removeListener(source, event, wrapper)
                })
            } : function(source, event, method, object) {
                var wrapper = Event.wrapper(method, object);
                Event._removeListener(source, event, wrapper)
            },
            _removeListener: function(source, event, wrapper) {
                if (event == "drop") {
                    DragDrop.removeDropListener(source)
                } else {
                    if (source == Event.XFRAME) {} else {
                        if (Event.isBuiltIn(source, event)) {
                            Event.removeDomListener(source, event, wrapper)
                        }
                    }
                }
                var listeners = eventMap.getPVListeners(source, event) || [];
                for (var i = 0; i < listeners.length; ++i) {
                    if (listeners[i] == wrapper) {
                        listeners.splice(i, 1);
                        return
                    }
                }
            },
            addCustomBubble: function(child, parent) {
                if (child == parent) {
                    console.log("parent is the same as child");
                    return
                }
                var childId = getUID(child);
                if (!bubbleMap[childId]) {
                    bubbleMap[childId] = []
                }
                bubbleMap[childId].push(parent)
            },
            bubble: function() {
                var source = arguments[0];
                var event = arguments[1];
                var evt = arguments[2] || {};
                while (source) {
                    var listeners;
                    if ((listeners = eventMap.getPVListeners(source, event)) && listeners.length) {
                        arguments[0] = source;
                        Event.trigger.apply(Event, arguments);
                        if (evt.cancelBubble) {
                            break
                        }
                    }
                    source = source.parentNode
                }
            },
            trigger: function() {
                var source = arguments[0];
                var event = arguments[1];
                var i;
                var listenedEvent = eventMap.getListenedEvent(source, event);
                if (listenedEvent) {
                    var fireOnce = Event.FIREONCE.get(source, event);
                    if (fireOnce !== undefined) {
                        if (fireOnce) {
                            return
                        }
                    }
                    var args = Array.prototype.slice.apply(arguments, [2]);
                    if (listenedEvent.shouldBundle) {
                        listenedEvent.triggered = args;
                        return
                    }
                    var listeners = listenedEvent.listeners.slice(0);
                    var listener;
                    var errs = [];
                    if (Conf.isStaging()) {
                        for (i = 0; i < listeners.length; ++i) {
                            listener = listeners[i];
                            listener.apply(listener, args)
                        }
                    } else {
                        for (i = 0; i < listeners.length; ++i) {
                            listener = listeners[i];
                            try {
                                listener.apply(listener, args)
                            } catch (e) {
                                errs.push(e)
                            }
                        }
                    }
                    if (errs.length) {
                        console.error("Handlers for event ", event, " had errors: ", errs);
                        throw errs[0]
                    }
                } else {}
                var sourceId = getUID(source);
                if (bubbleMap[sourceId]) {
                    var parents = bubbleMap[sourceId];
                    for (i = 0; i < parents.length; i++) {
                        arguments[0] = parents[i];
                        Event.trigger.apply(Event, arguments)
                    }
                }
            },
            release: function(source) {
                eventMap.release(source);
                var sourceId = getUID(source);
                if (bubbleMap[sourceId]) {
                    delete bubbleMap[sourceId]
                }
                if (window.DragDrop !== undefined) {
                    DragDrop.removeDropListener(source)
                }
            },
            releaseAll: function() {
                eventMap.releaseAll(function(sourceId) {
                    if (bubbleMap[sourceId]) {
                        delete bubbleMap[sourceId]
                    }
                });
                if (window.DragDrop !== undefined) {
                    DragDrop.removeDropListener(source)
                }
            },
            rateLimit: function(method, delay) {
                if (!delay) {
                    return method
                } else {
                    var timer = new Timer();
                    var timerIsSet = true;
                    var hadCall = null;
                    timer.replace(function() {
                        if (hadCall) {
                            method.apply(null, hadCall);
                            timerIsSet = true;
                            hadCall = null;
                            timer.reschedule(delay)
                        } else {
                            hadCall = null;
                            timerIsSet = false
                        }
                    }, delay);
                    return function() {
                        if (timerIsSet) {
                            hadCall = arguments;
                            return
                        }
                        method.apply(null, arguments);
                        timerIsSet = true;
                        timer.reschedule(delay)
                    }
                }
            },
            wrapper: function(method, object) {
                if (!method) {
                    var jslint = window._Debug && window._Debug.logStackTrace();
                    console.log("Wrapper called with method = ", method);
                    return noop
                }
                if (!method.apply) {
                    var jslint2 = window._Debug && window._Debug.logStackTrace();
                    var origFunc = method;
                    method = function() {
                        window.__func = origFunc;
                        window.__obj = object;
                        window.__args = arguments;
                        var args = [];
                        for (var i = 0; i < arguments.length; ++i) {
                            args.push("__args[" + i + "]")
                        }
                        var rval = eval("(__obj || window).__func(" + args.join(",") + ")");
                        delete window.__args;
                        delete window.__obj;
                        delete window.__func;
                        return rval
                    }
                }
                var cacheKey = getUID(method) + ":" + getUID(object);
                if (window._Debug && (Browser.isFirefox || Browser.isChrome)) {
                    var stack = _Debug.getStackTrace();
                    var func = function() {
                        try {
                            return method.apply(object, arguments)
                        } catch (e) {
                            console.error(e, {
                                exception: e,
                                method: method,
                                object: object,
                                wrappedBy: stack,
                                stack: e.stack.split(/\n/)
                            })
                        }
                    };
                    WRAPPERS[cacheKey] = WRAPPERS[cacheKey] || [];
                    WRAPPERS[cacheKey].push(func);
                    return func
                } else {
                    if (!object) {
                        return method
                    }
                    return (WRAPPERS[cacheKey] = WRAPPERS[cacheKey] || function() {
                        return method.apply(object, arguments)
                    })
                }
            },
            isBuiltIn: function(src, name) {
                if ((src.childNodes || src == window) && BUILTINS[name]) {
                    return true
                } else {
                    return false
                }
            },
            getSource: function(e) {
                return e.target || e.srcElement
            },
            getWheelDelta: function(e) {
                e = e || window.event;
                if (!e) {
                    return 0
                } else {
                    if (Browser.isIE) {
                        try {
                            return -e.wheelDelta / 120
                        } catch (err) {
                            return 0
                        }
                    } else {
                        if (Browser.isFirefox) {
                            return e.detail
                        } else {
                            if (Browser.isSafari || Browser.isChrome) {
                                return -e.wheelDelta / 3
                            } else {
                                return 0
                            }
                        }
                    }
                }
            },
            getRelatedTarget: function(e) {
                return e.relatedTarget || e.toElement || e.fromElement
            },
            stopBubble: function(event) {
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation()
                }
            },
            stopDefault: function(event) {
                if (event.preventDefault) {
                    event.preventDefault()
                } else {
                    event.returnValue = false
                }
                return false
            },
            defaultPrevented: function(e) {
                return (e.defaultPrevented || e.returnValue === false || !!(e.getPreventDefault && e.getPreventDefault()))
            },
            stop: function(event) {
                Event.stopBubble(event);
                return Event.stopDefault(event)
            },
            checkForBackendEvent: function() {
                var events = Cookie.get("e", true);
                if (!events || !events.uuid) {
                    Event.trigger(Event, "backend_events_triggered");
                    return
                }
                var now = new Date().getTime();
                if (!events._lts) {
                    events._lts = now;
                    Cookie.set("e", events)
                }
                if (baseTime - events._lts > 20000) {
                    Cookie.clear("e");
                    Event.trigger(Event, "backend_events_triggered");
                    return
                }
                Event.triggerBackendEvents(events.list, events.uuid)
            },
            triggerBackendEvents: function(list, uuid) {
                Event.addListener(document, "modifiable", function() {
                    yield(function() {
                        var seen = WindowSession.get("events") || {};
                        if (!seen[uuid]) {
                            seen[uuid] = new Date().getTime();
                            forEachKey(seen, function(k) {
                                if (baseTime - seen[k] > 30000) {
                                    delete seen[k]
                                }
                            });
                            WindowSession.set("events", seen);
                            (list || []).forEach(function(event) {
                                event.unshift(Event.BACKEND);
                                Event.trigger.apply(Event, event)
                            })
                        }
                        Event.trigger(Event, "backend_events_triggered")
                    })
                })
            },
            bundleEvents: function(source, event) {
                var listenedEvent = eventMap.getOrInitEventObjects(source, event);
                if (listenedEvent) {
                    delete listenedEvent.triggered;
                    listenedEvent.shouldBundle = (listenedEvent.shouldBundle || 0) + 1
                }
            },
            unbundleEvents: function(source, event, noTrigger) {
                var listenedEvent = eventMap.getListenedEvent(source, event);
                if (!listenedEvent) {
                    return
                }
                listenedEvent.shouldBundle = (listenedEvent.shouldBundle || 0) - 1;
                if (listenedEvent.shouldBundle > 0) {
                    return
                }
                var lastTriggeredWithArgs = listenedEvent.triggered;
                delete listenedEvent.triggered;
                if (lastTriggeredWithArgs === undefined) {
                    return
                }
                if (noTrigger) {
                    return
                }
                var args = [source, event];
                args = args.concat(lastTriggeredWithArgs || []);
                Event.trigger.apply(Event, args)
            },
            pauseEvents: function(source, event) {
                Event.bundleEvents(source, event)
            },
            unpauseEvents: function(source, event) {
                Event.unbundleEvents(source, event, true)
            },
            XFRAME: {},
            BACKEND: {},
            FIREONCE: {
                get: function(src, event) {
                    var obj = fireOnceHash.get(src);
                    if (!obj) {
                        return undefined
                    }
                    return obj[event]
                },
                declare: function(src, event) {
                    var declaredEvents = fireOnceHash.get(src);
                    if (!declaredEvents) {
                        declaredEvents = {};
                        fireOnceHash.put(src, declaredEvents)
                    }
                    if (declaredEvents[event] === undefined) {
                        declaredEvents[event] = false;
                        var listener = Event.addListener(src, event, function() {
                            listener.clean();
                            declaredEvents[event] = true
                        })
                    }
                },
                reset: function(src, event) {
                    var declaredEvents = fireOnceHash.get(src);
                    if (!declaredEvents) {
                        console.log("WARNING: resetting an undeclared fireonce event");
                        return
                    }
                    declaredEvents[event] = false;
                    var listener = Event.addListener(src, event, function() {
                        listener.clean();
                        declaredEvents[event] = true
                    })
                }
            }
        }
    }();
    Event.FIREONCE.declare(window, "load");
    Event.FIREONCE.declare(document, "domready");
    Event.FIREONCE.declare(document, "modifiable");
    Event.FIREONCE.declare(document, "available");
    Event.FIREONCE.declare(Event, "backend_events_triggered");
    if (!Browser.isIE) {
        Event._domModOnAvail = Event.addListener(document, "available", function(e) {
            Event.trigger(document, "modifiable", e);
            if (Event._domModOnAvail) {
                Event._domModOnAvail.clean();
                delete Event._domModOnAvail
            }
        })
    }
    Event._domModOnReady = Event.addListener(document, "domready", function(e) {
        var triggerDomModifiable = function() {
            Event.trigger(document, "modifiable", e);
            if (Event._domModOnReady) {
                Event._domModOnReady.clean();
                delete Event._domModOnReady
            }
        };
        if (Browser.isIE && (document.getElementsByTagName("embed") || []).length) {
            window.setTimeout(triggerDomModifiable, 1000)
        } else {
            triggerDomModifiable()
        }
    });
    Event.addListener(window, "load", function() {
        if (!Event.FIREONCE.get(document, "domready")) {
            if (Browser.isSafari) {
                if (Event._safariTimer) {
                    Event._safariTimer.clear();
                    Event._safariTimer = null
                }
            }
            Event.trigger(document, "domready")
        }
        document.write = function(str) {
            (document.write._buffer = document.write._buffer || []).push(str)
        };
        document.writeln = function(str) {
            (document.write._buffer = document.write._buffer || []).push(str + "\n")
        }
    });
    if (Browser.isIE) {
        if (document.location.protocol != "https:") {
            document.write('<script id="__ie_onload" defer src="javascript:void(0)"><\/script>');
            try {
                document.getElementById("__ie_onload").onreadystatechange = function() {
                    if (this.readyState == "complete") {
                        Event.trigger(document, "domready")
                    }
                }
            } catch (ignore) {}
        }
    } else {
        if (Browser.isSafari) {
            Event._safariTimer = new Interval(10, function() {
                if (/loaded|complete/.test(document.readyState)) {
                    if (Event._safariTimer) {
                        Event._safariTimer.clear();
                        Event._safariTimer = null
                    }
                    Event.trigger(document, "domready")
                }
            })
        } else {
            if (Browser.isFirefox || Browser.isMozilla || Browser.isOpera) {
                Event.addListener(document, "DOMContentLoaded", function() {
                    Event.trigger(document, "domready")
                })
            } else {}
        }
    }
    Event.addListener(window, "beforeunload", function() {
        if (Event.BACKEND.listening) {
            Event.removeListener(Cookie, "change", Event.checkForBackendEvent);
            Event.BACKEND.listening = false
        }
    });

    function Monitor(f, interval) {
        var curr = f();
        if (!interval) {
            interval = 100
        }
        this.check = function() {
            var now = f();
            if (now != curr) {
                curr = now;
                Event.trigger(this, "change", curr)
            }
            return now
        };
        this.timer = new Interval(interval, this.check, this)
    }
    Monitor.prototype.stop = function() {
        this.timer.clear()
    };

    function ScrollBottomDetector(options) {
        this.checkInterval = options.checkInterval || 1000;
        if (options.node) {
            this.attach(options.node)
        }
        this.clear()
    }
    ScrollBottomDetector.prototype.clear = function() {
        this._container = null;
        if (this._interval) {
            this._interval.clear();
            this._interval = null
        }
    };
    ScrollBottomDetector.prototype.isAttached = function() {
        return this._container !== null
    };
    ScrollBottomDetector.prototype.isAtBottom = function() {
        var dim;
        if (!this._container || !(dim = Dim.fromNode(this._container))) {
            this.clear();
            return false
        } else {
            if (dim.h === 0 && dim.w === 0) {
                return false
            }
        }
        var viewportHeight = getWindowSize().h;
        var viewportBottom = scrollXY().y + viewportHeight;
        var nodeBottom;
        if (this._container == document.body) {
            nodeBottom = nodeXY(this._container).y + this._container.parentNode.scrollHeight
        } else {
            nodeBottom = nodeXY(this._container).y + Dim.fromNode(this._container).h
        }
        return Math.abs(nodeBottom - viewportBottom) < Math.max(100, 1.5 * viewportHeight)
    };
    ScrollBottomDetector.prototype.attach = function(node) {
        this._container = node;
        if (!this._interval) {
            this._interval = new Interval(this.checkInterval, function() {
                if (this.isAtBottom()) {
                    Event.trigger(this._container, "scrollbottom")
                }
            }, this)
        }
        yield(function() {
            if (this.isAtBottom()) {
                Event.trigger(this._container, "scrollbottom")
            }
        }, this)
    };
    var WindowSession = function() {
        function evalName(data) {
            try {
                return JSON2.parse(data)
            } catch (e) {}
            return null
        }
        var data = {};
        Event.addListener(document, "modifiable", function() {
            data = evalName(window.name);
            if (!data || !data._pvid) {
                data = {
                    _pvid: Math.random()
                }
            }
        });
        return {
            id: function() {
                return data._pvid
            },
            set: function(name, value) {
                data[name] = value;
                window.name = JSON2.stringify(data)
            },
            get: function(name) {
                return data[name]
            },
            all: function() {
                return data
            }
        }
    }();

    function isRightClick(e) {
        if (e.which) {
            return (e.which == 3)
        } else {
            if (e.button !== undefined) {
                return (e.button == 2)
            }
        }
        return false
    }
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch (e) {}
    var NATIVE_APP_PROTOCOL = "polyvore:";
    var pvWindowTimeOutId;

    function scrollXY(tmp) {
        if (!tmp) {
            tmp = new Point(0, 0)
        }
        if (window.pageXOffset !== undefined) {
            tmp.x = window.pageXOffset;
            tmp.y = window.pageYOffset
        } else {
            if (document.documentElement) {
                tmp.x = document.documentElement.scrollLeft;
                tmp.y = document.documentElement.scrollTop
            } else {
                tmp.x = document.body.scrollLeft;
                tmp.y = document.body.scrollTop
            }
        }
        return tmp
    }

    function setScroll(pos) {
        var d = document.documentElement;
        var b = document.body;
        d.scrollLeft = b.scrollLeft = pos.x;
        d.scrollTop = b.scrollTop = pos.y
    }

    function Point(x, y) {
        this.x = x;
        this.y = y
    }

    function nodeXY(node) {
        if (node.getBoundingClientRect) {
            var box = node.getBoundingClientRect();
            var doc = document;
            var left = box.left;
            var top = box.top;
            if (Browser.isIE) {
                left -= 2;
                top -= 2
            }
            var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
            var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
            return new Point(left + scrollLeft, top + scrollTop)
        } else {
            var result = new Point(node.offsetLeft, node.offsetTop);
            var parentNode = node.offsetParent;
            var hasAbs = getStyle(node, "position") == "absolute";
            if (parentNode != node) {
                while (parentNode) {
                    result.x += parentNode.offsetLeft;
                    result.y += parentNode.offsetTop;
                    if (Browser.isSafari && !hasAbs && getStyle(parentNode, "position") == "absolute") {
                        hasAbs = true
                    }
                    parentNode = parentNode.offsetParent
                }
            }
            if (Browser.isSafari && hasAbs) {
                result.x -= document.body.offsetLeft;
                result.y -= document.body.offsetTop
            }
            parentNode = node.parentNode;
            while (parentNode && parentNode.tagName != "HTML" && parentNode.tagName != "BODY") {
                if (getStyle(parentNode, "display") != "inline") {
                    result.x -= parentNode.scrollLeft;
                    result.y -= parentNode.scrollTop
                }
                parentNode = parentNode.parentNode
            }
            return result
        }
    }

    function getWindowSize() {
        var mode = document.compatMode;
        if (mode || Browser.isIE) {
            if (mode == "CSS1Compat") {
                return {
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight
                }
            } else {
                return {
                    w: document.body.clientWidth,
                    h: document.body.clientHeight
                }
            }
        } else {
            return {
                w: window.innerWidth,
                h: window.innerHeight
            }
        }
    }

    function getStyle(node, prop) {
        if (node.nodeType != 1) {
            return null
        }
        if (node.style && node.style[prop]) {
            return node.style[prop]
        } else {
            if (node.currentStyle) {
                return node.currentStyle[prop]
            } else {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    prop = prop.replace(/([A-Z])/g, "-$1");
                    prop = prop.toLowerCase();
                    var s = document.defaultView.getComputedStyle(node, "");
                    return s && s.getPropertyValue(prop)
                } else {
                    return null
                }
            }
        }
    }

    function isVisible(node) {
        var display = getStyle(node, "display");
        var visibility = getStyle(node, "visibility");
        var dim = nodeDim(node);
        return dim.w > 0 && dim.h > 0 && display != "none" && visibility != "hidden" && visibility != "collapse"
    }

    function isChildrenVisible(node) {
        var display = getStyle(node, "display");
        var visibility = getStyle(node, "visibility");
        return display != "none" && visibility != "hidden" && visibility != "collapse"
    }
    var beaconBaseUrl;
    (function() {
        var url = window.location.href;
        var protocol = url.match(/^(\w+):/)[1];
        if (protocol != "https") {
            protocl = "http"
        }
        beaconBaseUrl = protocol + "://" + Conf.getWebUrlPrefix() + "/rsrc/beacon.gif"
    })();

    function beacon(type, data) {
        var url = beaconBaseUrl + "?t=" + encodeURIComponent(new Date().getTime()) + "&";
        var params = ["type=" + type];
        if (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var value = data[key];
                    if (value !== undefined) {
                        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
                    }
                }
            }
        }
        url += params.join("&");
        var img = new Image();
        img.src = url;
        img.onload = function() {
            removeNode(img)
        };
        img.onerror = function() {
            removeNode(img)
        };
        if (hidden) {
            hidden.appendChild(img)
        } else {
            document.body.appendChild(img)
        }
    }

    function urlHost(url) {
        if (url) {
            var match = url.match(/\/\/([^\/]*)/);
            if (match) {
                return match[1]
            }
        }
        return null
    }

    function convertPropertyName(a, l) {
        return "-" + l.toLowerCase()
    }

    function setNode(node, attr, style, inner) {
        if (!node) {
            return false
        }
        var i;
        if (style) {
            if (Browser.isIE && style["float"]) {
                style.cssFloat = style["float"]
            }
            for (i in style) {
                if (style.hasOwnProperty(i)) {
                    if (Browser.isIE && i == "opacity" && typeof(node.style.filter) == "string") {
                        node.style.filter = "alpha(opacity=" + style[i] * 100 + ")";
                        if (!node.currentStyle || !node.currentStyle.hasLayout) {
                            node.style.zoom = 1
                        }
                        continue
                    }
                    try {
                        if (node.style[i] != style[i]) {
                            if (node.style.setProperty) {
                                node.style.setProperty(i.replace(/([A-Z])/, convertPropertyName), style[i], "important")
                            } else {
                                node.style[i] = style[i]
                            }
                        }
                    } catch (e) {}
                }
            }
        }
        if (attr) {
            for (i in attr) {
                if (attr.hasOwnProperty(i)) {
                    var value = attr[i];
                    if (value || value === false || value === 0) {
                        node.setAttribute(i, value);
                        if (i == "className") {
                            node.setAttribute("class", value)
                        }
                    } else {
                        node.removeAttribute(i);
                        if (i == "className") {
                            node.removeAttribute("class")
                        }
                    }
                }
            }
        }
        if (inner) {
            node.innerHTML = inner
        }
        return node
    }

    function maxZIndex() {
        var maxZ = 4999990;
        var children = document.body.childNodes || [];
        for (var i = 0; i < children.length; ++i) {
            maxZ = Math.max(maxZ, Math.ceil(parseFloat(getStyle(children[i], "zIndex"))) || 0)
        }
        return maxZ + 10
    }
    var textContent;
    if (Browser.type("IE", null, 8)) {
        textContent = function(node) {
            return node.innerText
        }
    } else {
        textContent = function(node) {
            return node.textContent
        }
    }

    function stripHtml(text) {
        text = text.replace(/<[^>]*>/g, "");
        text = text.replace(/[ \t]+/g, " ");
        return text
    }

    function getVisibleHtmlText(text) {
        text = text.replace(/<script[^>]*>.*?<\/script>/ig, "");
        text = text.replace(/<head[^>]*>.*?<\/head>/ig, "");
        text = text.replace(/<style[^>]*>.*?<\/style>/ig, "");
        text = stripHtml(text);
        text = text.replace(/([\s\u00a0]){2,}/g, "$1");
        return text
    }
    var timer = null;
    var goodImageSizes = {};
    var imageCache = {};
    var iframe, hidden, block;
    var docReferrer;
    var docReferrerSize = -1;
    try {
        if (window.opener) {
            docReferrer = window.opener.location.href;
            docReferrerSize = getVisibleHtmlText(textContent(window.opener.document.body)).length
        }
    } catch (ignore1) {}
    if (!docReferrer) {
        docReferrer = document.referrer
    }
    var docLocation = document.location.href;
    var docSize = getVisibleHtmlText(textContent(document.body)).length;
    var linkCount = 0;
    var links = document.getElementsByTagName("A");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.href && link.href.indexOf("javascript") !== 0 && link.href != docLocation && link.href.indexOf(docLocation + "#") !== 0) {
            linkCount++
        }
    }

    function getBaseURL() {
        var refURL = encodeURIComponent(window.location);
        var productTitle = encodeURIComponent(document.title);
        if (window._clipperOptions && window._clipperOptions.product_url) {
            refURL = encodeURIComponent(window._clipperOptions.product_url)
        }
        if (window._clipperOptions && window._clipperOptions.name) {
            productTitle = encodeURIComponent(window._clipperOptions.name)
        }
        return document.location.protocol + "//" + Conf.getWebUrlPrefix() + "/cgi/clipper.form?ref=" + refURL + "&title=" + productTitle
    }
    var addURL = getBaseURL();
    if (window._polyvoreOptions && window._polyvoreOptions.type) {
        addURL += "&clip_type=" + encodeURIComponent(window._polyvoreOptions.type)
    }

    function init() {
        var blockZIndex = maxZIndex();
        var containerZIndex = blockZIndex + 10;
        var iframeZIndex = containerZIndex + 10;
        var addURL = getBaseURL();
        if (window._polyvoreOptions) {
            if (window._polyvoreOptions.type) {
                addURL += "&clip_type=" + encodeURIComponent(window._polyvoreOptions.type)
            }
            if (window._polyvoreOptions.isExtension) {
                addURL += "&is_extension=true"
            }
        }
        var params = [];
        if (window._clipperOptions) {
            for (var i in window._clipperOptions) {
                if (window._clipperOptions.hasOwnProperty(i)) {
                    params.push(i)
                }
            }
            if (params.length > 0) {
                addURL += "&readonly=true";
                for (var j = 0; j < params.length; j += 1) {
                    addURL += "&" + params[j] + "=" + encodeURIComponent(window._clipperOptions[params[j]])
                }
            }
        }
        block = setNode(document.createElement("div"), null, {
            display: "none",
            zIndex: blockZIndex,
            position: "fixed",
            top: "0px",
            left: "0px",
            backgroundColor: "#000000",
            width: "100%",
            height: "100%",
            opacity: "0.50",
            filter: "alpha(opacity=50)",
            "-ms-filter": "alpha(opacity=50)"
        });
        document.body.insertBefore(block, document.body.childNodes[0]);
        iframe = setNode(document.createElement("iframe"), {
            name: "polyvore_inline",
            scrolling: "no",
            allowTransparency: "true",
            frameBorder: 0,
            width: "700",
            height: "90",
            src: addURL
        }, {
            display: "none",
            width: "700px",
            height: "90px",
            top: "0px",
            right: "0px",
            scroll: "none",
            overflow: "hidden",
            position: Browser.isIE ? "absolute" : "fixed",
            border: "0px",
            backgroundColor: "transparent",
            zIndex: iframeZIndex
        });
        if (Browser.isIPhoneOrIPod) {
            setNode(iframe, null, {
                width: "90%",
                height: "auto",
                left: "5%",
                top: "0"
            })
        }
        document.body.appendChild(iframe);
        Event.addListener(Event.XFRAME, "done", cancel);
        Event.addListener(Event.XFRAME, "back", cancel);
        Event.addListener(Event.XFRAME, "ready", onIframeReady);
        Event.addListener(Event.XFRAME, "iframe_resize", resizeIFrame);
        Event.addListener(Event.XFRAME, "iframe_show", showIframe);
        Event.addListener(window, "resize", autoAdjustIframeSize);
        if (Browser.isIE) {
            Event.addListener(window, "scroll", scrollIFrame)
        }
        if (Browser.isIPhoneOrIPod) {
            Event.addListener(Event.XFRAME, "iframe_resize_mobile", resizeIFrameMobile)
        }
        hidden = setNode(document.createElement("div"), null, {
            position: "absolute",
            bottom: "-1000px",
            right: "-1000px"
        });
        document.body.appendChild(hidden);
        autoAdjustIframeSize()
    }
    var VISIBLE_HEIGHT_IPHONE_TALL = 472;
    var VISIBLE_HEIGHT_IPHONE = 383;
    var SCREEN_HEIGHT_IPHONE = 480;
    var curZoomLevelMobile = 1;

    function resizeIFrameMobile(dim) {
        var newZoomLevelMobile = window.innerWidth / screen.width;
        newZoomLevelMobile = Math.max(0, newZoomLevelMobile);
        if (newZoomLevelMobile != curZoomLevelMobile) {
            postMessage("zoom_level_changed_mobile", newZoomLevelMobile);
            curZoomLevelMobile = newZoomLevelMobile
        }
        if (!dim) {
            return
        }
        var visibleHeight = VISIBLE_HEIGHT_IPHONE_TALL;
        if (screen.height <= SCREEN_HEIGHT_IPHONE) {
            visibleHeight = VISIBLE_HEIGHT_IPHONE
        }
        var top = (((visibleHeight - dim.h) / 2) / visibleHeight * 100).toFixed(2);
        setNode(iframe, null, {
            top: Math.max(0, top) + "%",
            left: "5%"
        })
    }

    function resizeIFrame(dim) {
        var winDim = getWindowSize();
        setNode(iframe, null, {
            top: Math.max(0, Math.floor((winDim.h - dim.h) * 0.38)) + "px",
            left: Math.max(0, Math.floor((winDim.w - dim.w) / 2)) + "px",
            height: dim.h + "px",
            width: dim.w + "px"
        })
    }

    function scrollIFrame(e) {
        var top = 0;
        if (document.documentElement) {
            top = document.documentElement.scrollTop
        } else {
            top = document.body.scrollTop
        }
        iframe.style.top = top + "px"
    }

    function imgAnchor(img) {
        var curr = img.parentNode;
        var i = 0;
        while (curr && ++i < 5) {
            if (curr.tagName == "A") {
                return curr
            }
            curr = curr.parentNode
        }
        return null
    }

    function nodeDim(node) {
        return {
            w: parseInt(node.offsetWidth, 10),
            h: parseInt(node.offsetHeight, 10)
        }
    }

    function removeNode(node) {
        if (node) {
            var parent = node.parentNode;
            if (parent) {
                parent.removeChild(node)
            }
        }
    }

    function isGoodImage(imgDim, node) {
        var displayDim = nodeDim(node);
        displayDim.w = displayDim.w || 1;
        displayDim.h = displayDim.h || 1;
        var actualDim = {
            w: imgDim.w || 1,
            h: imgDim.h || 1
        };
        var displaySize = displayDim.w * displayDim.h;
        var actualSize = actualDim.w * actualDim.h;
        var threshold = 200 * 200;
        if (displaySize >= threshold && actualSize >= threshold) {
            var displayAspect = displayDim.w / displayDim.h;
            var actualAspect = actualDim.w / actualDim.h;
            if (displayAspect < 3 && displayAspect > 0.33 && actualAspect < 3 && actualAspect > 0.33) {
                return true
            }
        }
        imageSizeErr = true;
        return false
    }

    function imageDim(url, callback) {
        if (!url) {
            return {
                w: 0,
                h: 0
            }
        }
        var result = imageCache[url];
        if (result) {
            return result
        }
        var tmp = new Image();
        tmp.src = url;
        hidden.appendChild(tmp);
        if (tmp.naturalWidth && tmp.naturalHeight) {
            result = {
                w: tmp.naturalWidth,
                h: tmp.naturalHeight
            }
        } else {
            result = nodeDim(tmp)
        }
        removeNode(tmp);
        if (result.w === 0 && result.h === 0) {
            tmp = new Image();
            tmp.onload = function() {
                result = nodeDim(tmp);
                removeNode(tmp);
                imageCache[url] = result;
                if (callback) {
                    callback.call()
                }
            };
            tmp.onerror = function() {
                removeNode(tmp);
                imageCache[url] = {
                    w: 0,
                    h: 0
                }
            };
            setNode(tmp, {
                src: url
            }, {
                position: "absolute"
            });
            hidden.appendChild(tmp);
            return null
        } else {
            imageCache[url] = result;
            return result
        }
    }
    var goodImageUrls = {};
    var foundGoodImage = false;
    var firstScan = true;
    var imageSizeErr = false;

    function scanWindow(w) {
        var newImages = [];
        var document = w.document;
        if (!firstScan && w._polyvoreBodyText == document.body.innerHTML) {
            return newImages
        }
        var images = [];
        var imageDimCb = function() {
            w._polyvoreBodyText = ""
        };
        var i, j, img, imgNode, src, imgDim;
        var nodes = document.getElementsByTagName("img");
        var tmpNodes = [];
        for (i = 0; i < nodes.length; i++) {
            tmpNodes.push(nodes[i])
        }
        for (i = 0; i < tmpNodes.length; i++) {
            img = tmpNodes[i];
            src = img.src;
            imgDim = imageDim(src, imageDimCb);
            if (imgDim && isGoodImage(imgDim, img)) {
                if (!goodImageUrls[src]) {
                    images.push(img);
                    foundGoodImage = true;
                    goodImageUrls[src] = true
                }
            }
        }
        nodes = document.getElementsByTagName("div");
        for (i = 0; i < nodes.length; ++i) {
            var div = nodes[i];
            src = getStyle(div, "backgroundImage");
            if (src != "none") {
                var nestedImages = div.getElementsByTagName("img");
                var skip = false;
                for (var n = 0; n < nestedImages.length; ++n) {
                    var nested = nestedImages[n];
                    imgDim = imageDim(nested.getAttribute("src"), imageDimCb);
                    if (!imgDim) {
                        skip = true;
                        break
                    }
                    if (isVisible(nested) && isGoodImage(imgDim, nested)) {
                        skip = true;
                        break
                    }
                }
                if (skip) {
                    continue
                }
                var url = src.match(new RegExp("url\\(([^)]+)\\)"));
                if (url) {
                    url = url[1];
                    imgDim = imageDim(url, imageDimCb);
                    if (imgDim && isGoodImage(imgDim, div)) {
                        if (!goodImageUrls[url]) {
                            div.src = url;
                            images.push(div);
                            foundGoodImage = true;
                            goodImageUrls[url] = true
                        }
                    }
                }
            }
        }
        for (i = 0; i < images.length; ++i) {
            img = images[i];
            src = img.src;
            var dim = imageDim(src);
            var xy = nodeXY(img);
            var key = dim.w + "," + dim.h;
            if (goodImageSizes[key]) {
                goodImageSizes[key]++
            } else {
                goodImageSizes[key] = 1
            }
            var r = nodeXY(img);
            r.x1 = r.x + img.offsetWidth;
            r.y1 = r.y + img.offsetHeight;
            newImages.push({
                visible: isVisible(img),
                pixelCount: dim.w * dim.h,
                imgurl: src,
                renderedDim: nodeDim(img),
                rect: r,
                anchor: imgAnchor(img)
            })
        }
        if (newImages.length) {
            document.body.normalize();
            var prices = [];
            var price;
            try {
                searchSubTree(document.body, prices)
            } catch (e) {
                console.log(e)
            }
            if (prices.length) {
                for (i = 0; i < newImages.length; i++) {
                    var imgInfo = newImages[i];
                    var priceRecord = null;
                    for (j = 0; j < prices.length; j++) {
                        price = prices[j];
                        if (priceRecord) {
                            var score1 = price.fontWeight / Math.max(pointNodeDistance(price.pos, imgInfo.rect), 1);
                            var score2 = priceRecord.fontWeight / Math.max(pointNodeDistance(priceRecord.pos, imgInfo.rect), 1);
                            if (price.fontSize && priceRecord.fontSize && price.fontUnit == priceRecord.fontUnit) {
                                score1 *= price.fontSize;
                                score2 *= priceRecord.fontSize
                            }
                            score1 *= (price.fontStyle && price.fontStyle == "italic" ? 1.5 : 1);
                            score2 *= (priceRecord.fontStyle && priceRecord.fontStyle == "italic" ? 1.5 : 1);
                            if (score1 > score2) {
                                priceRecord = price
                            }
                        } else {
                            priceRecord = price
                        }
                    }
                    imgInfo.priceRecord = {
                        price: priceRecord.price,
                        currency: priceRecord.currency
                    };
                    delete imgInfo.rect
                }
                var uniqPrices = [];
                var priceMap = {};
                for (i = 0; i < prices.length; i++) {
                    price = prices[i];
                    if ((+price.price) === 0) {
                        continue
                    }
                    priceMap[price.label] = {
                        price: price.price,
                        currency: price.currency,
                        label: price.label
                    }
                }
                for (i in priceMap) {
                    if (priceMap.hasOwnProperty(i)) {
                        uniqPrices.push(priceMap[i])
                    }
                }
                uniqPrices.sort(function(a, b) {
                    if (a.currency == b.currency) {
                        return a.price - b.price
                    } else {
                        if (a.currency < b.currency) {
                            return -1
                        } else {
                            return 1
                        }
                    }
                });
                postMessage("prices", uniqPrices)
            } else {
                postMessage("prices", null)
            }
        }
        w._polyvoreBodyText = document.body.innerHTML;
        return newImages
    }
    var badFrames = [];

    function scan() {
        var images = scanWindow(window);
        var skipFrames = false;
        if (window._polyvoreOptions && window._polyvoreOptions.skipFrames) {
            skipFrames = true
        }
        if (window._clipperOptions && window._clipperOptions.image_url) {
            if (firstScan) {
                url = window._clipperOptions.product_url || docReferrer || "";
                var optImgs = [{
                    imgurl: window._clipperOptions.image_url,
                    url: url
                }];
                postMessage("images", optImgs);
                firstScan = false
            }
            return
        }
        var i, j;
        if (!skipFrames) {
            for (i = 0; i < window.frames.length; i++) {
                var frame = window.frames[i];
                var badFrame = false;
                for (j = 0; j < badFrames.length; j++) {
                    try {
                        if (badFrames[j] == frame) {
                            badFrame = true;
                            break
                        }
                    } catch (e) {}
                }
                if (badFrame) {
                    continue
                }
                try {
                    var frameImages = scanWindow(frame);
                    if (frameImages.length) {
                        images = images.concat(frameImages)
                    }
                } catch (e2) {
                    badFrames.push(frame)
                }
            }
        }
        if (images.length) {
            var data = [];
            for (i = 0; i < images.length; i++) {
                var url = null;
                var followRedirect = false;
                var size = -1;
                if (images.length == 1 && linkCount < 5) {
                    url = docReferrer;
                    size = docReferrerSize
                }
                var image = images[i];
                var dim = image.renderedDim;
                var key = dim.w + "," + dim.h;
                var repeatedImage = goodImageSizes[key] > 5;
                if (repeatedImage) {
                    var anchor = image.anchor;
                    if (anchor && (anchor.href.indexOf("http://") === 0) && !anchor.getAttribute("target")) {
                        url = anchor.href;
                        var pageHost = docLocation.match(/\/\/([^\/]*)/)[1];
                        var urlHost = url.match(/\/\/([^\/]*)/)[1];
                        followRedirect = (pageHost != urlHost)
                    }
                }
                if (!url) {
                    url = docLocation;
                    size = docSize
                }
                if (size === 0) {
                    size = 1
                }
                if (size == -1) {
                    size = 0
                }
                var clipPrice = image.priceRecord && !repeatedImage;
                data.push({
                    visible: image.visible,
                    pixelCount: image.pixelCount,
                    page_size: size,
                    imgurl: image.imgurl.replace(/#$/, ""),
                    alturl: (url != docLocation),
                    url: url.replace(/#$/, ""),
                    followredirect: followRedirect,
                    pagetitle: document.title,
                    priceRecord: clipPrice ? image.priceRecord : null
                })
            }
            postMessage("images", data)
        }
        firstScan = false
    }

    function showIframe() {
        setNode(block, null, {
            display: "block"
        });
        setNode(iframe, null, {
            display: "block"
        })
    }

    function autoAdjustIframeSize() {
        var dim = getWindowSize();
        dim.w -= 64;
        dim.h -= 64;
        postMessage("resize", dim);
        if (Browser.isIPhoneOrIPod) {
            resizeIFrameMobile()
        }
    }
    var messageQueue = [];
    var canPostToIframe = false;

    function postMessage(event, data) {
        var baseURL = getBaseURL();
        if (canPostToIframe) {
            Event.postMessage(iframe, baseURL, event, data)
        } else {
            messageQueue.push({
                event: event,
                data: data
            })
        }
    }

    function onIframeReady() {
        canPostToIframe = true;
        if (messageQueue.length) {
            for (var i = 0; i < messageQueue.length; i++) {
                var message = messageQueue[i];
                postMessage(message.event, message.data)
            }
            messageQueue = []
        }
        if (Browser.isIPad || Browser.isIPhoneOrIPod) {
            onClipperReady()
        }
    }

    function instrumentImage(node, img) {
        Event.addListener(node, "click", function(event) {
            clip(img);
            return Event.stop(event)
        })
    }

    function distSort(a, b) {
        return a.dist - b.dist
    }

    function cancel(complete) {
        if (timer) {
            timer.clear();
            timer = null
        }
        if (pvWindowTimeOutId) {
            window.clearTimeout(pvWindowTimeOutId);
            pvWindowTimeOutId = null
        }
        goodImageSizes = {};
        goodImageUrls = {};
        foundGoodImage = false;
        firstScan = true;
        Event.removeListener(Event.XFRAME, "done", cancel);
        Event.removeListener(Event.XFRAME, "iframe_resize", resizeIFrame);
        Event.removeListener(window, "scroll", scrollIFrame);
        Event.removeListener(window, "resize", autoAdjustIframeSize);
        Event.removeListener(Event.XFRAME, "iframe_resize_mobile", resizeIFrameMobile);
        removeNode(iframe);
        removeNode(block);
        block = iframe = null;
        canPostToIframe = false;
        curZoomLevelMobile = 1;
        if (Browser.isIPhoneOrIPod || Browser.isIPad) {
            onClipperDismissed(complete)
        }
    }

    function run() {
        var completed = false;
        window.setTimeout(function() {
            if (!completed) {
                beacon("clipperfail")
            }
        }, 0);
        if (timer) {
            cancel()
        }
        init();
        scan();
        timer = new Interval(50, scan);
        pvWindowTimeOutId = window.setTimeout(function() {
            var noImg = "Sorry, no images were found on this page. Please try another page.";
            if (!foundGoodImage) {
                beacon("clippernoimg");
                if (imageSizeErr) {
                    noImg = "Sorry, the images on this page are too small. Please try another page."
                }
                alert(noImg);
                cancel()
            }
        }, 1500);
        completed = true
    }

    function pointNodeDistance(p, r) {
        return [pointLineDistance(p.x, p.y, r.x, r.y, r.x1, r.y, true), pointLineDistance(p.x, p.y, r.x1, r.y, r.x1, r.y1, true), pointLineDistance(p.x, p.y, r.x1, r.y1, r.x, r.y1, true), pointLineDistance(p.x, p.y, r.x, r.y1, r.x, r.y, true)].sort(numericSort)[0]
    }

    function numericSort(a, b) {
        return a - b
    }

    function lineLength(x0, y0, x1, y1) {
        return Math.sqrt((x0 -= x1) * x0 + (y0 -= y1) * y0)
    }

    function pointLineIntersect(px, py, x0, y0, x1, y1) {
        if (x1 == x0) {
            return {
                x: x0,
                y: py
            }
        } else {
            if (y1 == y0) {
                return {
                    x: px,
                    y: y0
                }
            }
        }
        var tg = (x0 - x1) / (y1 - y0);
        var left = (x1 * (px * tg - py + y0) + x0 * (px * -tg + py - y1)) / (tg * (x1 - x0) + y0 - y1);
        return {
            x: left,
            y: tg * left - tg * px + py
        }
    }

    function pointInSegment(px, py, x0, y0, x1, y1) {
        return px >= Math.min(x0, x1) && px <= Math.max(x0, x1) && py >= Math.min(y0, y1) && py <= Math.max(y0, y1)
    }

    function pointLineDistance(px, py, x0, y0, x1, y1, seg) {
        if (seg) {
            var intersect = pointLineIntersect(px, py, x0, y0, x1, y1);
            if (!pointInSegment(intersect.x, intersect.y, x0, y0, x1, y1)) {
                return Math.min(lineLength(px, py, x0, y0), lineLength(px, py, x1, y1))
            }
        }
        var a = y0 - y1,
            b = x1 - x0,
            c = x0 * y1 - y0 * x1;
        return Math.abs(a * px + b * py + c) / Math.sqrt(a * a + b * b)
    }
    var currencies = ["RUB", "ру\\\u0431", "USD", "\\\u0024", "AUD", "A\\\u0024", "EUR", "euro", "\\\u20ac", "GBP", "\\\u00a3", "CAD", "CNY", "\\\u5143", "\\\ua1ef", "JPY", "\\\u00a5", "KRW", "\\\u20a9", "S\\\u0024", "B\\\u0024", "BR\\\u0024", "R\\\u0024", "SEK", "kr", "DKK", "PLN", "CHF", "NOK", "HKD", "HK\\\u0024", "NZD", "SGD"];
    var currencyMap = {};
    var charSet = document.charset || document.characterSet || "";
    switch (charSet.toUpperCase()) {
        case "SHIFT_JIS":
            currencies.push("\\\u005c");
            currencyMap["\u005c"] = "JPY";
            break;
        case "EUC-JP":
            currencies.push("\\\uffe5");
            currencyMap["\uffe5"] = "JPY";
            break
    }
    var currencyRE = currencies.join("|");
    var spaceRE = "[\\s\\\u00a0]*";
    var numRE = "\\d{1,10}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{1,2})?";
    var priceREStringG = "(" + currencyRE + ")" + spaceRE + "(" + numRE + ")(?!" + spaceRE + currencyRE + ")|\\$?(" + numRE + ")" + spaceRE + "(" + currencyRE + ")(?!" + spaceRE + numRE + ")";
    var priceREString = "(?:^|\\W|\\b)((" + currencyRE + ")" + spaceRE + "(" + numRE + ")(?!" + spaceRE + currencyRE + "))|(\\$?(" + numRE + ")" + spaceRE + "(" + currencyRE + "))(?:\\W|\\b|$)(?!" + spaceRE + numRE + ")";
    var priceREg = new RegExp(priceREStringG, "g");
    var priceRE = new RegExp(priceREString);

    function searchSubTree(node, result) {
        if (!node) {
            return 0
        }
        if (node.nodeType == 3) {
            return 0
        }
        var match;
        var nodeText = textContent(node);
        if (!nodeText) {
            return 0
        }
        nodeText = nodeText.replace(/\s+/g, " ");
        if ((match = nodeText.match(priceREg))) {
            if (node.nodeType != 1) {
                return match.length
            }
            switch (node.tagName) {
                case "SCRIPT":
                case "IFRAME":
                case "FRAME":
                case "STRIKE":
                case "DEL":
                case "S":
                    return match.length
            }
            if (getStyle(node, "textDecoration") == "line-through") {
                return match.length
            }
            if (!isChildrenVisible(node)) {
                return match.length
            }
            var subMatches = 0;
            for (var i = 0; i < node.childNodes.length && subMatches < match.length; ++i) {
                var kid = node.childNodes[i];
                subMatches += searchSubTree(kid, result)
            }
            if (subMatches < match.length) {
                var match2 = nodeText.match(priceRE);
                if (!match2) {
                    return match.length
                }
                var fontWeight = getStyle(node, "fontWeight") || "400";
                switch (fontWeight) {
                    case "normal":
                        fontWeight = 400;
                        break;
                    case "bold":
                        fontWeight = 700;
                        break;
                    case "bolder":
                        fontWeight = 900;
                        break;
                    case "lighter":
                        fontWeight = 200;
                        break;
                    default:
                        fontWeight = parseInt(fontWeight, 10)
                }
                if (fontWeight < 100) {
                    fontWeight = 100
                } else {
                    if (fontWeight > 900) {
                        fontWeight = 900
                    }
                }
                fontWeight /= 100;
                var fontSize = getStyle(node, "fontSize") || "";
                var fontUnit = null;
                if (fontSize.match(/^(\d+(?:\.\d+)?)(.+)$/)) {
                    fontSize = Number(RegExp.$1);
                    fontUnit = RegExp.$2
                } else {
                    if (fontSize.match(/xx-small|x-small|small|medium|large|x-large|xx-large/)) {
                        fontUnit = "size";
                        switch (fontSize) {
                            case "xx-small":
                                fontSize = 0.3;
                                break;
                            case "x-small":
                                fontSize = 0.5;
                                break;
                            case "small":
                                fontSize = 0.7;
                                break;
                            case "large":
                                fontSize = 1.5;
                                break;
                            case "x-large":
                                fontSize = 2;
                                break;
                            case "xx-large":
                                fontSize = 3;
                                break;
                            case "medium":
                                fontSize = 1;
                                break;
                            default:
                                fontSize = 1;
                                break
                        }
                    } else {
                        fontSize = 0
                    }
                }
                var currency = match2[2] || match2[6];
                currency = (currencyMap[currency] || currency);
                var priceRecord = {
                    fontSize: fontSize,
                    fontUnit: fontUnit,
                    fontWeight: fontWeight,
                    fontStyle: getStyle(node, "fontStyle"),
                    currency: currency,
                    price: match2[3] || match2[5],
                    label: match2[1] || match2[4],
                    pos: nodeXY(node)
                };
                var txtRatio = priceRecord.label.length / nodeText.length;
                if (txtRatio > 0.05) {
                    result.push(priceRecord)
                }
            }
            return match.length
        }
        return 0
    }

    function onClipperReady() {
        window.location = NATIVE_APP_PROTOCOL + "//web.archive.org/web/20160101070529/http://onclipperready/"
    }

    function onClipperDismissed(complete) {
        window.location = NATIVE_APP_PROTOCOL + "//web.archive.org/web/20160101070529/http://onclipperdismissed/?complete=" + complete
    }
    window.PolyvoreClipper = {};
    window.PolyvoreClipper.run = run;
    window.PolyvoreClipper.cancel = cancel;
    run()
})();
