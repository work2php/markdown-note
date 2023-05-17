/*
 * Editor.md
 *
 * @file        editormd.js
 * @version     v1.5.0
 * @description Open source online markdown editor.
 * @license     MIT License
 * @author      Pandao
 * {@link       https://github.com/pandao/editor.md}
 * @updateTime  2015-06-09
 */

;(function(factory) {
    "use strict";

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
    else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
        if (define.amd) // for Require.js
        {
            /* Require.js define replace */
        }
        else
        {
            define(["jquery"], factory);  // for Sea.js
        }
    }
    else
    {
        window.editormd = factory();
    }

}(function() {

    /* Require.js assignment replace */

    "use strict";

    var $ = (typeof (jQuery) !== "undefined") ? jQuery : Zepto;

    if (typeof ($) === "undefined") {
        return ;
    }

    /**
     * editormd
     *
     * @param   {String} id           缂栬緫鍣ㄧ殑ID
     * @param   {Object} options      閰嶇疆閫夐」 Key/Value
     * @returns {Object} editormd     杩斿洖editormd瀵硅薄
     */

    var editormd         = function (id, options) {
        return new editormd.fn.init(id, options);
    };

    editormd.title        = editormd.$name = "Editor.md";
    editormd.version      = "1.5.0";
    editormd.homePage     = "https://pandao.github.io/editor.md/";
    editormd.classPrefix  = "editormd-";

    editormd.toolbarModes = {
        full : [
            "undo", "redo", "|",
            "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
            "h1", "h2", "h3", "h4", "h5", "h6", "|",
            "list-ul", "list-ol", "hr", "|",
            "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|",
            "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|",
            "help", "info"
        ],
        simple : [
            "undo", "redo", "|",
            "bold", "del", "italic", "quote", "uppercase", "lowercase", "|",
            "h1", "h2", "h3", "h4", "h5", "h6", "|",
            "list-ul", "list-ol", "hr", "|",
            "watch", "preview", "fullscreen", "|",
            "help", "info"
        ],
        mini : [
            "undo", "redo", "|",
            "watch", "preview", "|",
            "help", "info"
        ]
    };

    editormd.defaults     = {
        mode                 : "gfm",          //gfm or markdown
        name                 : "",             // Form element name
        value                : "",             // value for CodeMirror, if mode not gfm/markdown
        theme                : "",             // Editor.md self themes, before v1.5.0 is CodeMirror theme, default empty
        editorTheme          : "default",      // Editor area, this is CodeMirror theme at v1.5.0
        previewTheme         : "",             // Preview area theme, default empty
        markdown             : "",             // Markdown source code
        appendMarkdown       : "",             // if in init textarea value not empty, append markdown to textarea
        width                : "100%",
        height               : "100%",
        path                 : "./lib/",       // Dependents module file directory
        pluginPath           : "",             // If this empty, default use settings.path + "../plugins/"
        delay                : 300,            // Delay parse markdown to html, Uint : ms
        autoLoadModules      : true,           // Automatic load dependent module files
        watch                : true,
        placeholder          : "Enjoy Markdown! coding now...",
        gotoLine             : true,
        codeFold             : false,
        autoHeight           : false,
        autoFocus            : true,
        autoCloseTags        : true,
        searchReplace        : true,
        syncScrolling        : true,           // true | false | "single", default true
        readOnly             : false,
        tabSize              : 4,
        indentUnit           : 4,
        lineNumbers          : true,
        lineWrapping         : true,
        autoCloseBrackets    : true,
        showTrailingSpace    : true,
        matchBrackets        : true,
        indentWithTabs       : true,
        styleSelectedText    : true,
        matchWordHighlight   : true,           // options: true, false, "onselected"
        styleActiveLine      : true,           // Highlight the current line
        dialogLockScreen     : true,
        dialogShowMask       : true,
        dialogDraggable      : true,
        dialogMaskBgColor    : "#fff",
        dialogMaskOpacity    : 0.1,
        fontSize             : "13px",
        saveHTMLToTextarea   : false,
        disabledKeyMaps      : [],

        onload               : function() {},
        onresize             : function() {},
        onchange             : function() {},
        onwatch              : null,
        onunwatch            : null,
        onpreviewing         : function() {},
        onpreviewed          : function() {},
        onfullscreen         : function() {},
        onfullscreenExit     : function() {},
        onscroll             : function() {},
        onpreviewscroll      : function() {},

        imageUpload          : false,
        imageFormats         : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL       : "",
        crossDomainUpload    : false,
        uploadCallbackURL    : "",

        toc                  : true,           // Table of contents
        tocm                 : false,           // Using [TOCM], auto create ToC dropdown menu
        tocTitle             : "",             // for ToC dropdown menu btn
        tocDropdown          : false,
        tocContainer         : "",
        tocStartLevel        : 1,              // Said from H1 to create ToC
        htmlDecode           : false,          // Open the HTML tag identification
        pageBreak            : true,           // Enable parse page break [========]
        atLink               : true,           // for @link
        emailLink            : true,           // for email address auto link
        taskList             : false,          // Enable Github Flavored Markdown task lists
        emoji                : false,          // :emoji: , Support Github emoji, Twitter Emoji (Twemoji);
                                               // Support FontAwesome icon emoji :fa-xxx: > Using fontAwesome icon web fonts;
                                               // Support Editor.md logo icon emoji :editormd-logo: :editormd-logo-1x: > 1~8x;
        tex                  : false,          // TeX(LaTeX), based on KaTeX
        flowChart            : false,          // flowChart.js only support IE9+
        sequenceDiagram      : false,          // sequenceDiagram.js only support IE9+
        previewCodeHighlight : true,

        toolbar              : true,           // show/hide toolbar
        toolbarAutoFixed     : true,           // on window scroll auto fixed position
        toolbarIcons         : "full",
        toolbarTitles        : {},
        toolbarHandlers      : {
            ucwords : function() {
                return editormd.toolbarHandlers.ucwords;
            },
            lowercase : function() {
                return editormd.toolbarHandlers.lowercase;
            }
        },
        toolbarCustomIcons   : {               // using html tag create toolbar icon, unused default <a> tag.
            lowercase        : "<a href=\"javascript:;\" title=\"Lowercase\" unselectable=\"on\"><i class=\"fa\" name=\"lowercase\" style=\"font-size:24px;margin-top: -10px;\">a</i></a>",
            "ucwords"        : "<a href=\"javascript:;\" title=\"ucwords\" unselectable=\"on\"><i class=\"fa\" name=\"ucwords\" style=\"font-size:20px;margin-top: -3px;\">Aa</i></a>"
        },
        toolbarIconsClass    : {
            undo             : "fa-undo",
            redo             : "fa-repeat",
            bold             : "fa-bold",
            del              : "fa-strikethrough",
            italic           : "fa-italic",
            quote            : "fa-quote-left",
            uppercase        : "fa-font",
            h1               : editormd.classPrefix + "bold",
            h2               : editormd.classPrefix + "bold",
            h3               : editormd.classPrefix + "bold",
            h4               : editormd.classPrefix + "bold",
            h5               : editormd.classPrefix + "bold",
            h6               : editormd.classPrefix + "bold",
            "list-ul"        : "fa-list-ul",
            "list-ol"        : "fa-list-ol",
            hr               : "fa-minus",
            link             : "fa-link",
            "reference-link" : "fa-anchor",
            image            : "fa-picture-o",
            code             : "fa-code",
            "preformatted-text" : "fa-file-code-o",
            "code-block"     : "fa-file-code-o",
            table            : "fa-table",
            datetime         : "fa-clock-o",
            emoji            : "fa-smile-o",
            "html-entities"  : "fa-copyright",
            pagebreak        : "fa-newspaper-o",
            "goto-line"      : "fa-terminal", // fa-crosshairs
            watch            : "fa-eye-slash",
            unwatch          : "fa-eye",
            preview          : "fa-desktop",
            search           : "fa-search",
            fullscreen       : "fa-arrows-alt",
            clear            : "fa-eraser",
            help             : "fa-question-circle",
            info             : "fa-info-circle"
        },
        toolbarIconTexts     : {},

        lang : {
            name        : "zh-cn",
            description : "寮€婧愬湪绾縈arkdown缂栬緫鍣�<br/>Open source online Markdown editor.",
            tocTitle    : "鐩綍",
            toolbar     : {
                undo             : "鎾ら攢锛圕trl+Z锛�",
                redo             : "閲嶅仛锛圕trl+Y锛�",
                bold             : "绮椾綋",
                del              : "鍒犻櫎绾�",
                italic           : "鏂滀綋",
                quote            : "寮曠敤",
                ucwords          : "灏嗘瘡涓崟璇嶉瀛楁瘝杞垚澶у啓",
                uppercase        : "灏嗘墍閫夎浆鎹㈡垚澶у啓",
                lowercase        : "灏嗘墍閫夎浆鎹㈡垚灏忓啓",
                h1               : "鏍囬1",
                h2               : "鏍囬2",
                h3               : "鏍囬3",
                h4               : "鏍囬4",
                h5               : "鏍囬5",
                h6               : "鏍囬6",
                "list-ul"        : "鏃犲簭鍒楄〃",
                "list-ol"        : "鏈夊簭鍒楄〃",
                hr               : "妯嚎",
                link             : "閾炬帴",
                "reference-link" : "寮曠敤閾炬帴",
                image            : "娣诲姞鍥剧墖",
                code             : "琛屽唴浠ｇ爜",
                "preformatted-text" : "棰勬牸寮忔枃鏈� / 浠ｇ爜鍧楋紙缂╄繘椋庢牸锛�",
                "code-block"     : "浠ｇ爜鍧楋紙澶氳瑷€椋庢牸锛�",
                table            : "娣诲姞琛ㄦ牸",
                datetime         : "鏃ユ湡鏃堕棿",
                emoji            : "Emoji琛ㄦ儏",
                "html-entities"  : "HTML瀹炰綋瀛楃",
                pagebreak        : "鎻掑叆鍒嗛〉绗�",
                "goto-line"      : "璺宠浆鍒拌",
                watch            : "鍏抽棴瀹炴椂棰勮",
                unwatch          : "寮€鍚疄鏃堕瑙�",
                preview          : "鍏ㄧ獥鍙ｉ瑙圚TML锛堟寜 Shift + ESC杩樺師锛�",
                fullscreen       : "鍏ㄥ睆锛堟寜ESC杩樺師锛�",
                clear            : "娓呯┖",
                search           : "鎼滅储",
                help             : "浣跨敤甯姪",
                info             : "鍏充簬" + editormd.title
            },
            buttons : {
                enter  : "纭畾",
                cancel : "鍙栨秷",
                close  : "鍏抽棴"
            },
            dialog : {
                link : {
                    title    : "娣诲姞閾炬帴",
                    url      : "閾炬帴鍦板潃",
                    urlTitle : "閾炬帴鏍囬",
                    urlEmpty : "閿欒锛氳濉啓閾炬帴鍦板潃銆�"
                },
                referenceLink : {
                    title    : "娣诲姞寮曠敤閾炬帴",
                    name     : "寮曠敤鍚嶇О",
                    url      : "閾炬帴鍦板潃",
                    urlId    : "閾炬帴ID",
                    urlTitle : "閾炬帴鏍囬",
                    nameEmpty: "閿欒锛氬紩鐢ㄩ摼鎺ョ殑鍚嶇О涓嶈兘涓虹┖銆�",
                    idEmpty  : "閿欒锛氳濉啓寮曠敤閾炬帴鐨処D銆�",
                    urlEmpty : "閿欒锛氳濉啓寮曠敤閾炬帴鐨刄RL鍦板潃銆�"
                },
                image : {
                    title    : "娣诲姞鍥剧墖",
                    url      : "鍥剧墖鍦板潃",
                    link     : "鍥剧墖閾炬帴",
                    alt      : "鍥剧墖鎻忚堪",
                    uploadButton     : "鏈湴涓婁紶",
                    imageURLEmpty    : "閿欒锛氬浘鐗囧湴鍧€涓嶈兘涓虹┖銆�",
                    uploadFileEmpty  : "閿欒锛氫笂浼犵殑鍥剧墖涓嶈兘涓虹┖銆�",
                    formatNotAllowed : "閿欒锛氬彧鍏佽涓婁紶鍥剧墖鏂囦欢锛屽厑璁镐笂浼犵殑鍥剧墖鏂囦欢鏍煎紡鏈夛細"
                },
                preformattedText : {
                    title             : "娣诲姞棰勬牸寮忔枃鏈垨浠ｇ爜鍧�",
                    emptyAlert        : "閿欒锛氳濉啓棰勬牸寮忔枃鏈垨浠ｇ爜鐨勫唴瀹广€�"
                },
                codeBlock : {
                    title             : "娣诲姞浠ｇ爜鍧�",
                    selectLabel       : "浠ｇ爜璇█锛�",
                    selectDefaultText : "璇烽€夋嫨浠ｇ爜璇█",
                    otherLanguage     : "鍏朵粬璇█",
                    unselectedLanguageAlert : "閿欒锛氳閫夋嫨浠ｇ爜鎵€灞炵殑璇█绫诲瀷銆�",
                    codeEmptyAlert    : "閿欒锛氳濉啓浠ｇ爜鍐呭銆�"
                },
                htmlEntities : {
                    title : "HTML 瀹炰綋瀛楃"
                },
                help : {
                    title : "浣跨敤甯姪"
                }
            }
        }
    };

    editormd.classNames  = {
        tex : editormd.classPrefix + "tex"
    };

    editormd.dialogZindex = 99999;

    editormd.$katex       = null;
    editormd.$marked      = null;
    editormd.$CodeMirror  = null;
    editormd.$prettyPrint = null;

    var timer, flowchartTimer;

    editormd.prototype    = editormd.fn = {
        state : {
            watching   : false,
            loaded     : false,
            preview    : false,
            fullscreen : false
        },

        /**
         * 鏋勯€犲嚱鏁�/瀹炰緥鍒濆鍖�
         * Constructor / instance initialization
         *
         * @param   {String}   id            缂栬緫鍣ㄧ殑ID
         * @param   {Object}   [options={}]  閰嶇疆閫夐」 Key/Value
         * @returns {editormd}               杩斿洖editormd鐨勫疄渚嬪璞�
         */

        init : function (id, options) {

            options              = options || {};

            if (typeof id === "object")
            {
                options = id;
            }

            var _this            = this;
            var classPrefix      = this.classPrefix  = editormd.classPrefix;
            var settings         = this.settings     = $.extend(true, editormd.defaults, options);

            id                   = (typeof id === "object") ? settings.id : id;

            var editor           = this.editor       = $("#" + id);

            this.id              = id;
            this.lang            = settings.lang;

            var classNames       = this.classNames   = {
                textarea : {
                    html     : classPrefix + "html-textarea",
                    markdown : classPrefix + "markdown-textarea"
                }
            };

            settings.pluginPath = (settings.pluginPath === "") ? settings.path + "../plugins/" : settings.pluginPath;

            this.state.watching = (settings.watch) ? true : false;

            if ( !editor.hasClass("editormd") ) {
                editor.addClass("editormd");
            }

            editor.css({
                width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
                height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
            });

            if (settings.autoHeight)
            {
                editor.css("height", "auto");
            }

            var markdownTextarea = this.markdownTextarea = editor.children("textarea");

            if (markdownTextarea.length < 1)
            {
                editor.append("<textarea></textarea>");
                markdownTextarea = this.markdownTextarea = editor.children("textarea");
            }

            markdownTextarea.addClass(classNames.textarea.markdown).attr("placeholder", settings.placeholder);

            if (typeof markdownTextarea.attr("name") === "undefined" || markdownTextarea.attr("name") === "")
            {
                markdownTextarea.attr("name", (settings.name !== "") ? settings.name : id + "-markdown-doc");
            }

            var appendElements = [
                (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",
                ( (settings.saveHTMLToTextarea) ? "<textarea class=\"" + classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "" ),
                "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
                "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
                "<div class=\"" + classPrefix + "mask\"></div>"
            ].join("\n");

            editor.append(appendElements).addClass(classPrefix + "vertical");

            if (settings.theme !== "")
            {
                editor.addClass(classPrefix + "theme-" + settings.theme);
            }

            this.mask          = editor.children("." + classPrefix + "mask");
            this.containerMask = editor.children("." + classPrefix  + "container-mask");

            if (settings.markdown !== "")
            {
                markdownTextarea.val(settings.markdown);
            }

            if (settings.appendMarkdown !== "")
            {
                markdownTextarea.val(markdownTextarea.val() + settings.appendMarkdown);
            }

            this.htmlTextarea     = editor.children("." + classNames.textarea.html);
            this.preview          = editor.children("." + classPrefix + "preview");
            this.previewContainer = this.preview.children("." + classPrefix + "preview-container");

            if (settings.previewTheme !== "")
            {
                this.preview.addClass(classPrefix + "preview-theme-" + settings.previewTheme);
            }

            if (typeof define === "function" && define.amd)
            {
                if (typeof katex !== "undefined")
                {
                    editormd.$katex = katex;
                }

                if (settings.searchReplace && !settings.readOnly)
                {
                    editormd.loadCSS(settings.path + "codemirror/addon/dialog/dialog");
                    editormd.loadCSS(settings.path + "codemirror/addon/search/matchesonscrollbar");
                }
            }

            if ((typeof define === "function" && define.amd) || !settings.autoLoadModules)
            {
                if (typeof CodeMirror !== "undefined") {
                    editormd.$CodeMirror = CodeMirror;
                }

                if (typeof marked     !== "undefined") {
                    editormd.$marked     = marked;
                }

                this.setCodeMirror().setToolbar().loadedDisplay();
            }
            else
            {
                this.loadQueues();
            }

            return this;
        },

        /**
         * 鎵€闇€缁勪欢鍔犺浇闃熷垪
         * Required components loading queue
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        loadQueues : function() {
            var _this        = this;
            var settings     = this.settings;
            var loadPath     = settings.path;

            var loadFlowChartOrSequenceDiagram = function() {

                if (editormd.isIE8)
                {
                    _this.loadedDisplay();

                    return ;
                }

                if (settings.flowChart || settings.sequenceDiagram)
                {
                    editormd.loadScript(loadPath + "raphael.min", function() {

                        editormd.loadScript(loadPath + "underscore.min", function() {

                            if (!settings.flowChart && settings.sequenceDiagram)
                            {
                                editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                    _this.loadedDisplay();
                                });
                            }
                            else if (settings.flowChart && !settings.sequenceDiagram)
                            {
                                editormd.loadScript(loadPath + "flowchart.min", function() {
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        _this.loadedDisplay();
                                    });
                                });
                            }
                            else if (settings.flowChart && settings.sequenceDiagram)
                            {
                                editormd.loadScript(loadPath + "flowchart.min", function() {
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                            _this.loadedDisplay();
                                        });
                                    });
                                });
                            }
                        });

                    });
                }
                else
                {
                    _this.loadedDisplay();
                }
            };

            editormd.loadCSS(loadPath + "codemirror/codemirror.min");

            if (settings.searchReplace && !settings.readOnly)
            {
                editormd.loadCSS(loadPath + "codemirror/addon/dialog/dialog");
                editormd.loadCSS(loadPath + "codemirror/addon/search/matchesonscrollbar");
            }

            if (settings.codeFold)
            {
                editormd.loadCSS(loadPath + "codemirror/addon/fold/foldgutter");
            }

            editormd.loadScript(loadPath + "codemirror/codemirror.min", function() {
                editormd.$CodeMirror = CodeMirror;

                editormd.loadScript(loadPath + "codemirror/modes.min", function() {

                    editormd.loadScript(loadPath + "codemirror/addons.min", function() {

                        _this.setCodeMirror();

                        if (settings.mode !== "gfm" && settings.mode !== "markdown")
                        {
                            _this.loadedDisplay();

                            return false;
                        }

                        _this.setToolbar();

                        editormd.loadScript(loadPath + "marked.min", function() {

                            editormd.$marked = marked;

                            if (settings.previewCodeHighlight)
                            {
                                editormd.loadScript(loadPath + "prettify.min", function() {
                                    loadFlowChartOrSequenceDiagram();
                                });
                            }
                            else
                            {
                                loadFlowChartOrSequenceDiagram();
                            }
                        });

                    });

                });

            });

            return this;
        },

        /**
         * 璁剧疆 Editor.md 鐨勬暣浣撲富棰橈紝涓昏鏄伐鍏锋爮
         * Setting Editor.md theme
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setTheme : function(theme) {
            var editor      = this.editor;
            var oldTheme    = this.settings.theme;
            var themePrefix = this.classPrefix + "theme-";

            editor.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);

            this.settings.theme = theme;

            return this;
        },

        /**
         * 璁剧疆 CodeMirror锛堢紪杈戝尯锛夌殑涓婚
         * Setting CodeMirror (Editor area) theme
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setEditorTheme : function(theme) {
            var settings   = this.settings;
            settings.editorTheme = theme;

            if (theme !== "default")
            {
                editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
            }

            this.cm.setOption("theme", theme);

            return this;
        },

        /**
         * setEditorTheme() 鐨勫埆鍚�
         * setEditorTheme() alias
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setCodeMirrorTheme : function (theme) {
            this.setEditorTheme(theme);

            return this;
        },

        /**
         * 璁剧疆 Editor.md 鐨勪富棰�
         * Setting Editor.md theme
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setPreviewTheme : function(theme) {
            var preview     = this.preview;
            var oldTheme    = this.settings.previewTheme;
            var themePrefix = this.classPrefix + "preview-theme-";

            preview.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);

            this.settings.previewTheme = theme;

            return this;
        },

        /**
         * 閰嶇疆鍜屽垵濮嬪寲CodeMirror缁勪欢
         * CodeMirror initialization
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setCodeMirror : function() {
            var settings         = this.settings;
            var editor           = this.editor;

            if (settings.editorTheme !== "default")
            {
                editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
            }

            var codeMirrorConfig = {
                mode                      : settings.mode,
                theme                     : settings.editorTheme,
                tabSize                   : settings.tabSize,
                dragDrop                  : false,
                autofocus                 : settings.autoFocus,
                autoCloseTags             : settings.autoCloseTags,
                readOnly                  : (settings.readOnly) ? "nocursor" : false,
                indentUnit                : settings.indentUnit,
                lineNumbers               : settings.lineNumbers,
                lineWrapping              : settings.lineWrapping,
                extraKeys                 : {
                    "Ctrl-Q": function(cm) {
                        cm.foldCode(cm.getCursor());
                    }
                },
                foldGutter                : settings.codeFold,
                gutters                   : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets             : settings.matchBrackets,
                indentWithTabs            : settings.indentWithTabs,
                styleActiveLine           : settings.styleActiveLine,
                styleSelectedText         : settings.styleSelectedText,
                autoCloseBrackets         : settings.autoCloseBrackets,
                showTrailingSpace         : settings.showTrailingSpace,
                highlightSelectionMatches : ( (!settings.matchWordHighlight) ? false : { showToken: (settings.matchWordHighlight === "onselected") ? false : /\w/ } )
            };

            this.codeEditor = this.cm        = editormd.$CodeMirror.fromTextArea(this.markdownTextarea[0], codeMirrorConfig);
            this.codeMirror = this.cmElement = editor.children(".CodeMirror");

            if (settings.value !== "")
            {
                this.cm.setValue(settings.value);
            }

            this.codeMirror.css({
                fontSize : settings.fontSize,
                width    : (!settings.watch) ? "100%" : "50%"
            });

            if (settings.autoHeight)
            {
                this.codeMirror.css("height", "auto");
                this.cm.setOption("viewportMargin", Infinity);
            }

            if (!settings.lineNumbers)
            {
                this.codeMirror.find(".CodeMirror-gutters").css("border-right", "none");
            }

            return this;
        },

        /**
         * 鑾峰彇CodeMirror鐨勯厤缃€夐」
         * Get CodeMirror setting options
         *
         * @returns {Mixed}                  return CodeMirror setting option value
         */

        getCodeMirrorOption : function(key) {
            return this.cm.getOption(key);
        },

        /**
         * 閰嶇疆鍜岄噸閰嶇疆CodeMirror鐨勯€夐」
         * CodeMirror setting options / resettings
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setCodeMirrorOption : function(key, value) {

            this.cm.setOption(key, value);

            return this;
        },

        /**
         * 娣诲姞 CodeMirror 閿洏蹇嵎閿�
         * Add CodeMirror keyboard shortcuts key map
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        addKeyMap : function(map, bottom) {
            this.cm.addKeyMap(map, bottom);

            return this;
        },

        /**
         * 绉婚櫎 CodeMirror 閿洏蹇嵎閿�
         * Remove CodeMirror keyboard shortcuts key map
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        removeKeyMap : function(map) {
            this.cm.removeKeyMap(map);

            return this;
        },

        /**
         * 璺宠浆鍒版寚瀹氱殑琛�
         * Goto CodeMirror line
         *
         * @param   {String|Intiger}   line      line number or "first"|"last"
         * @returns {editormd}                   杩斿洖editormd鐨勫疄渚嬪璞�
         */

        gotoLine : function (line) {

            var settings = this.settings;

            if (!settings.gotoLine)
            {
                return this;
            }

            var cm       = this.cm;
            var editor   = this.editor;
            var count    = cm.lineCount();
            var preview  = this.preview;

            if (typeof line === "string")
            {
                if(line === "last")
                {
                    line = count;
                }

                if (line === "first")
                {
                    line = 1;
                }
            }

            if (typeof line !== "number")
            {
                alert("Error: The line number must be an integer.");
                return this;
            }

            line  = parseInt(line) - 1;

            if (line > count)
            {
                alert("Error: The line number range 1-" + count);

                return this;
            }

            cm.setCursor( {line : line, ch : 0} );

            var scrollInfo   = cm.getScrollInfo();
            var clientHeight = scrollInfo.clientHeight;
            var coords       = cm.charCoords({line : line, ch : 0}, "local");

            cm.scrollTo(null, (coords.top + coords.bottom - clientHeight) / 2);

            if (settings.watch)
            {
                var cmScroll  = this.codeMirror.find(".CodeMirror-scroll")[0];
                var height    = $(cmScroll).height();
                var scrollTop = cmScroll.scrollTop;
                var percent   = (scrollTop / cmScroll.scrollHeight);

                if (scrollTop === 0)
                {
                    preview.scrollTop(0);
                }
                else if (scrollTop + height >= cmScroll.scrollHeight - 16)
                {
                    preview.scrollTop(preview[0].scrollHeight);
                }
                else
                {
                    preview.scrollTop(preview[0].scrollHeight * percent);
                }
            }

            cm.focus();

            return this;
        },

        /**
         * 鎵╁睍褰撳墠瀹炰緥瀵硅薄锛屽彲鍚屾椂璁剧疆澶氫釜鎴栬€呭彧璁剧疆涓€涓�
         * Extend editormd instance object, can mutil setting.
         *
         * @returns {editormd}                  this(editormd instance object.)
         */

        extend : function() {
            if (typeof arguments[1] !== "undefined")
            {
                if (typeof arguments[1] === "function")
                {
                    arguments[1] = $.proxy(arguments[1], this);
                }

                this[arguments[0]] = arguments[1];
            }

            if (typeof arguments[0] === "object" && typeof arguments[0].length === "undefined")
            {
                $.extend(true, this, arguments[0]);
            }

            return this;
        },

        /**
         * 璁剧疆鎴栨墿灞曞綋鍓嶅疄渚嬪璞★紝鍗曚釜璁剧疆
         * Extend editormd instance object, one by one
         *
         * @param   {String|Object}   key       option key
         * @param   {String|Object}   value     option value
         * @returns {editormd}                  this(editormd instance object.)
         */

        set : function (key, value) {

            if (typeof value !== "undefined" && typeof value === "function")
            {
                value = $.proxy(value, this);
            }

            this[key] = value;

            return this;
        },

        /**
         * 閲嶆柊閰嶇疆
         * Resetting editor options
         *
         * @param   {String|Object}   key       option key
         * @param   {String|Object}   value     option value
         * @returns {editormd}                  this(editormd instance object.)
         */

        config : function(key, value) {
            var settings = this.settings;

            if (typeof key === "object")
            {
                settings = $.extend(true, settings, key);
            }

            if (typeof key === "string")
            {
                settings[key] = value;
            }

            this.settings = settings;
            this.recreate();

            return this;
        },

        /**
         * 娉ㄥ唽浜嬩欢澶勭悊鏂规硶
         * Bind editor event handle
         *
         * @param   {String}     eventType      event type
         * @param   {Function}   callback       鍥炶皟鍑芥暟
         * @returns {editormd}                  this(editormd instance object.)
         */

        on : function(eventType, callback) {
            var settings = this.settings;

            if (typeof settings["on" + eventType] !== "undefined")
            {
                settings["on" + eventType] = $.proxy(callback, this);
            }

            return this;
        },

        /**
         * 瑙ｉ櫎浜嬩欢澶勭悊鏂规硶
         * Unbind editor event handle
         *
         * @param   {String}   eventType          event type
         * @returns {editormd}                    this(editormd instance object.)
         */

        off : function(eventType) {
            var settings = this.settings;

            if (typeof settings["on" + eventType] !== "undefined")
            {
                settings["on" + eventType] = function(){};
            }

            return this;
        },

        /**
         * 鏄剧ず宸ュ叿鏍�
         * Display toolbar
         *
         * @param   {Function} [callback=function(){}] 鍥炶皟鍑芥暟
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        showToolbar : function(callback) {
            var settings = this.settings;

            if(settings.readOnly) {
                return this;
            }

            if (settings.toolbar && (this.toolbar.length < 1 || this.toolbar.find("." + this.classPrefix + "menu").html() === "") )
            {
                this.setToolbar();
            }

            settings.toolbar = true;

            this.toolbar.show();
            this.resize();

            $.proxy(callback || function(){}, this)();

            return this;
        },

        /**
         * 闅愯棌宸ュ叿鏍�
         * Hide toolbar
         *
         * @param   {Function} [callback=function(){}] 鍥炶皟鍑芥暟
         * @returns {editormd}                         this(editormd instance object.)
         */

        hideToolbar : function(callback) {
            var settings = this.settings;

            settings.toolbar = false;
            this.toolbar.hide();
            this.resize();

            $.proxy(callback || function(){}, this)();

            return this;
        },

        /**
         * 椤甸潰婊氬姩鏃跺伐鍏锋爮鐨勫浐瀹氬畾浣�
         * Set toolbar in window scroll auto fixed position
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setToolbarAutoFixed : function(fixed) {

            var state    = this.state;
            var editor   = this.editor;
            var toolbar  = this.toolbar;
            var settings = this.settings;

            if (typeof fixed !== "undefined")
            {
                settings.toolbarAutoFixed = fixed;
            }

            var autoFixedHandle = function(){
                var $window = $(window);
                var top     = $window.scrollTop();

                if (!settings.toolbarAutoFixed)
                {
                    return false;
                }

                if (top - editor.offset().top > 10 && top < editor.height())
                {
                    toolbar.css({
                        position : "fixed",
                        width    : editor.width() + "px",
                        left     : ($window.width() - editor.width()) / 2 + "px"
                    });
                }
                else
                {
                    toolbar.css({
                        position : "absolute",
                        width    : "100%",
                        left     : 0
                    });
                }
            };

            if (!state.fullscreen && !state.preview && settings.toolbar && settings.toolbarAutoFixed)
            {
                $(window).bind("scroll", autoFixedHandle);
            }

            return this;
        },

        /**
         * 閰嶇疆鍜屽垵濮嬪寲宸ュ叿鏍�
         * Set toolbar and Initialization
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setToolbar : function() {
            var settings    = this.settings;

            if(settings.readOnly) {
                return this;
            }

            var editor      = this.editor;
            var preview     = this.preview;
            var classPrefix = this.classPrefix;

            var toolbar     = this.toolbar = editor.children("." + classPrefix + "toolbar");

            if (settings.toolbar && toolbar.length < 1)
            {
                var toolbarHTML = "<div class=\"" + classPrefix + "toolbar\"><div class=\"" + classPrefix + "toolbar-container\"><ul class=\"" + classPrefix + "menu\"></ul></div></div>";

                editor.append(toolbarHTML);
                toolbar = this.toolbar = editor.children("." + classPrefix + "toolbar");
            }

            if (!settings.toolbar)
            {
                toolbar.hide();

                return this;
            }

            toolbar.show();

            var icons       = (typeof settings.toolbarIcons === "function") ? settings.toolbarIcons()
                : ((typeof settings.toolbarIcons === "string")  ? editormd.toolbarModes[settings.toolbarIcons] : settings.toolbarIcons);

            var toolbarMenu = toolbar.find("." + this.classPrefix + "menu"), menu = "";
            var pullRight   = false;

            for (var i = 0, len = icons.length; i < len; i++)
            {
                var name = icons[i];

                if (name === "||")
                {
                    pullRight = true;
                }
                else if (name === "|")
                {
                    menu += "<li class=\"divider\" unselectable=\"on\">|</li>";
                }
                else
                {
                    var isHeader = (/h(\d)/.test(name));
                    var index    = name;

                    if (name === "watch" && !settings.watch) {
                        index = "unwatch";
                    }

                    var title     = settings.lang.toolbar[index];
                    var iconTexts = settings.toolbarIconTexts[index];
                    var iconClass = settings.toolbarIconsClass[index];

                    title     = (typeof title     === "undefined") ? "" : title;
                    iconTexts = (typeof iconTexts === "undefined") ? "" : iconTexts;
                    iconClass = (typeof iconClass === "undefined") ? "" : iconClass;

                    var menuItem = pullRight ? "<li class=\"pull-right\">" : "<li>";

                    if (typeof settings.toolbarCustomIcons[name] !== "undefined" && typeof settings.toolbarCustomIcons[name] !== "function")
                    {
                        menuItem += settings.toolbarCustomIcons[name];
                    }
                    else
                    {
                        menuItem += "<a href=\"javascript:;\" title=\"" + title + "\" unselectable=\"on\">";
                        menuItem += "<i class=\"fa " + iconClass + "\" name=\""+name+"\" unselectable=\"on\">"+((isHeader) ? name.toUpperCase() : ( (iconClass === "") ? iconTexts : "") ) + "</i>";
                        menuItem += "</a>";
                    }

                    menuItem += "</li>";

                    menu = pullRight ? menuItem + menu : menu + menuItem;
                }
            }

            toolbarMenu.html(menu);

            toolbarMenu.find("[title=\"Lowercase\"]").attr("title", settings.lang.toolbar.lowercase);
            toolbarMenu.find("[title=\"ucwords\"]").attr("title", settings.lang.toolbar.ucwords);

            this.setToolbarHandler();
            this.setToolbarAutoFixed();

            return this;
        },

        /**
         * 宸ュ叿鏍忓浘鏍囦簨浠跺鐞嗗璞″簭鍒�
         * Get toolbar icons event handlers
         *
         * @param   {Object}   cm    CodeMirror鐨勫疄渚嬪璞�
         * @param   {String}   name  瑕佽幏鍙栫殑浜嬩欢澶勭悊鍣ㄥ悕绉�
         * @returns {Object}         杩斿洖澶勭悊瀵硅薄搴忓垪
         */

        dialogLockScreen : function() {
            $.proxy(editormd.dialogLockScreen, this)();

            return this;
        },

        dialogShowMask : function(dialog) {
            $.proxy(editormd.dialogShowMask, this)(dialog);

            return this;
        },

        getToolbarHandles : function(name) {
            var toolbarHandlers = this.toolbarHandlers = editormd.toolbarHandlers;

            return (name && typeof toolbarIconHandlers[name] !== "undefined") ? toolbarHandlers[name] : toolbarHandlers;
        },

        /**
         * 宸ュ叿鏍忓浘鏍囦簨浠跺鐞嗗櫒
         * Bind toolbar icons event handle
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setToolbarHandler : function() {
            var _this               = this;
            var settings            = this.settings;

            if (!settings.toolbar || settings.readOnly) {
                return this;
            }

            var toolbar             = this.toolbar;
            var cm                  = this.cm;
            var classPrefix         = this.classPrefix;
            var toolbarIcons        = this.toolbarIcons = toolbar.find("." + classPrefix + "menu > li > a");
            var toolbarIconHandlers = this.getToolbarHandles();

            toolbarIcons.bind(editormd.mouseOrTouch("click", "touchend"), function(event) {

                var icon                = $(this).children(".fa");
                var name                = icon.attr("name");
                var cursor              = cm.getCursor();
                var selection           = cm.getSelection();

                if (name === "") {
                    return ;
                }

                _this.activeIcon = icon;

                if (typeof toolbarIconHandlers[name] !== "undefined")
                {
                    $.proxy(toolbarIconHandlers[name], _this)(cm);
                }
                else
                {
                    if (typeof settings.toolbarHandlers[name] !== "undefined")
                    {
                        $.proxy(settings.toolbarHandlers[name], _this)(cm, icon, cursor, selection);
                    }
                }

                if (name !== "link" && name !== "reference-link" && name !== "image" && name !== "code-block" &&
                    name !== "preformatted-text" && name !== "watch" && name !== "preview" && name !== "search" && name !== "fullscreen" && name !== "info")
                {
                    cm.focus();
                }

                return false;

            });

            return this;
        },

        /**
         * 鍔ㄦ€佸垱寤哄璇濇
         * Creating custom dialogs
         *
         * @param   {Object} options  閰嶇疆椤归敭鍊煎 Key/Value
         * @returns {dialog}          杩斿洖鍒涘缓鐨刣ialog鐨刯Query瀹炰緥瀵硅薄
         */

        createDialog : function(options) {
            return $.proxy(editormd.createDialog, this)(options);
        },

        /**
         * 鍒涘缓鍏充簬Editor.md鐨勫璇濇
         * Create about Editor.md dialog
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        createInfoDialog : function() {
            var _this        = this;
            var editor       = this.editor;
            var classPrefix  = this.classPrefix;

            var infoDialogHTML = [
                "<div class=\"" + classPrefix + "dialog " + classPrefix + "dialog-info\" style=\"\">",
                "<div class=\"" + classPrefix + "dialog-container\">",
                "<h1><i class=\"editormd-logo editormd-logo-lg editormd-logo-color\"></i> " + editormd.title + "<small>v" + editormd.version + "</small></h1>",
                "<p>" + this.lang.description + "</p>",
                "<p style=\"margin: 10px 0 20px 0;\"><a href=\"" + editormd.homePage + "\" target=\"_blank\">" + editormd.homePage + " <i class=\"fa fa-external-link\"></i></a></p>",
                "<p style=\"font-size: 0.85em;\">Copyright &copy; 2015 <a href=\"https://github.com/pandao\" target=\"_blank\" class=\"hover-link\">Pandao</a>, The <a href=\"https://github.com/pandao/editor.md/blob/master/LICENSE\" target=\"_blank\" class=\"hover-link\">MIT</a> License.</p>",
                "</div>",
                "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>",
                "</div>"
            ].join("\n");

            editor.append(infoDialogHTML);

            var infoDialog  = this.infoDialog = editor.children("." + classPrefix + "dialog-info");

            infoDialog.find("." + classPrefix + "dialog-close").bind(editormd.mouseOrTouch("click", "touchend"), function() {
                _this.hideInfoDialog();
            });

            infoDialog.css("border", (editormd.isIE8) ? "1px solid #ddd" : "").css("z-index", editormd.dialogZindex).show();

            this.infoDialogPosition();

            return this;
        },

        /**
         * 鍏充簬Editor.md瀵硅瘽灞呬腑瀹氫綅
         * Editor.md dialog position handle
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        infoDialogPosition : function() {
            var infoDialog = this.infoDialog;

            var _infoDialogPosition = function() {
                infoDialog.css({
                    top  : ($(window).height() - infoDialog.height()) / 2 + "px",
                    left : ($(window).width()  - infoDialog.width()) / 2  + "px"
                });
            };

            _infoDialogPosition();

            $(window).resize(_infoDialogPosition);

            return this;
        },

        /**
         * 鏄剧ず鍏充簬Editor.md
         * Display about Editor.md dialog
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        showInfoDialog : function() {

            $("html,body").css("overflow-x", "hidden");

            var _this       = this;
            var editor      = this.editor;
            var settings    = this.settings;
            var infoDialog  = this.infoDialog = editor.children("." + this.classPrefix + "dialog-info");

            if (infoDialog.length < 1)
            {
                this.createInfoDialog();
            }

            this.lockScreen(true);

            this.mask.css({
                opacity         : settings.dialogMaskOpacity,
                backgroundColor : settings.dialogMaskBgColor
            }).show();

            infoDialog.css("z-index", editormd.dialogZindex).show();

            this.infoDialogPosition();

            return this;
        },

        /**
         * 闅愯棌鍏充簬Editor.md
         * Hide about Editor.md dialog
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        hideInfoDialog : function() {
            $("html,body").css("overflow-x", "");
            this.infoDialog.hide();
            this.mask.hide();
            this.lockScreen(false);

            return this;
        },

        /**
         * 閿佸睆
         * lock screen
         *
         * @param   {Boolean}    lock    Boolean 甯冨皵鍊硷紝鏄惁閿佸睆
         * @returns {editormd}           杩斿洖editormd鐨勫疄渚嬪璞�
         */

        lockScreen : function(lock) {
            editormd.lockScreen(lock);
            this.resize();

            return this;
        },

        /**
         * 缂栬緫鍣ㄧ晫闈㈤噸寤猴紝鐢ㄤ簬鍔ㄦ€佽瑷€鍖呮垨妯″潡鍔犺浇绛�
         * Recreate editor
         *
         * @returns {editormd}  杩斿洖editormd鐨勫疄渚嬪璞�
         */

        recreate : function() {
            var _this            = this;
            var editor           = this.editor;
            var settings         = this.settings;

            this.codeMirror.remove();

            this.setCodeMirror();

            if (!settings.readOnly)
            {
                if (editor.find(".editormd-dialog").length > 0) {
                    editor.find(".editormd-dialog").remove();
                }

                if (settings.toolbar)
                {
                    this.getToolbarHandles();
                    this.setToolbar();
                }
            }

            this.loadedDisplay(true);

            return this;
        },

        /**
         * 楂樹寒棰勮HTML鐨刾re浠ｇ爜閮ㄥ垎
         * highlight of preview codes
         *
         * @returns {editormd}             杩斿洖editormd鐨勫疄渚嬪璞�
         */

        previewCodeHighlight : function() {
            var settings         = this.settings;
            var previewContainer = this.previewContainer;

            if (settings.previewCodeHighlight)
            {
                previewContainer.find("pre").addClass("prettyprint linenums");

                if (typeof prettyPrint !== "undefined")
                {
                    prettyPrint();
                }
            }

            return this;
        },

        /**
         * 瑙ｆ瀽TeX(KaTeX)绉戝鍏紡
         * TeX(KaTeX) Renderer
         *
         * @returns {editormd}             杩斿洖editormd鐨勫疄渚嬪璞�
         */

        katexRender : function() {

            if (timer === null)
            {
                return this;
            }

            this.previewContainer.find("." + editormd.classNames.tex).each(function(){
                var tex  = $(this);
                editormd.$katex.render(tex.text(), tex[0]);

                tex.find(".katex").css("font-size", "1.6em");
            });

            return this;
        },

        /**
         * 瑙ｆ瀽鍜屾覆鏌撴祦绋嬪浘鍙婃椂搴忓浘
         * FlowChart and SequenceDiagram Renderer
         *
         * @returns {editormd}             杩斿洖editormd鐨勫疄渚嬪璞�
         */

        flowChartAndSequenceDiagramRender : function() {
            var $this            = this;
            var settings         = this.settings;
            var previewContainer = this.previewContainer;

            if (editormd.isIE8) {
                return this;
            }

            if (settings.flowChart) {
                if (flowchartTimer === null) {
                    return this;
                }

                previewContainer.find(".flowchart").flowChart();
            }

            if (settings.sequenceDiagram) {
                previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }

            var preview    = $this.preview;
            var codeMirror = $this.codeMirror;
            var codeView   = codeMirror.find(".CodeMirror-scroll");

            var height    = codeView.height();
            var scrollTop = codeView.scrollTop();
            var percent   = (scrollTop / codeView[0].scrollHeight);
            var tocHeight = 0;

            preview.find(".markdown-toc-list").each(function(){
                tocHeight += $(this).height();
            });

            var tocMenuHeight = preview.find(".editormd-toc-menu").height();
            tocMenuHeight = (!tocMenuHeight) ? 0 : tocMenuHeight;

            if (scrollTop === 0)
            {
                preview.scrollTop(0);
            }
            else if (scrollTop + height >= codeView[0].scrollHeight - 16)
            {
                preview.scrollTop(preview[0].scrollHeight);
            }
            else
            {
                preview.scrollTop((preview[0].scrollHeight + tocHeight + tocMenuHeight) * percent);
            }

            return this;
        },

        /**
         * 娉ㄥ唽閿洏蹇嵎閿鐞�
         * Register CodeMirror keyMaps (keyboard shortcuts).
         *
         * @param   {Object}    keyMap      KeyMap key/value {"(Ctrl/Shift/Alt)-Key" : function(){}}
         * @returns {editormd}              return this
         */

        registerKeyMaps : function(keyMap) {

            var _this           = this;
            var cm              = this.cm;
            var settings        = this.settings;
            var toolbarHandlers = editormd.toolbarHandlers;
            var disabledKeyMaps = settings.disabledKeyMaps;

            keyMap              = keyMap || null;

            if (keyMap)
            {
                for (var i in keyMap)
                {
                    if ($.inArray(i, disabledKeyMaps) < 0)
                    {
                        var map = {};
                        map[i]  = keyMap[i];

                        cm.addKeyMap(keyMap);
                    }
                }
            }
            else
            {
                for (var k in editormd.keyMaps)
                {
                    var _keyMap = editormd.keyMaps[k];
                    var handle = (typeof _keyMap === "string") ? $.proxy(toolbarHandlers[_keyMap], _this) : $.proxy(_keyMap, _this);

                    if ($.inArray(k, ["F9", "F10", "F11"]) < 0 && $.inArray(k, disabledKeyMaps) < 0)
                    {
                        var _map = {};
                        _map[k] = handle;

                        cm.addKeyMap(_map);
                    }
                }

                $(window).keydown(function(event) {

                    var keymaps = {
                        "120" : "F9",
                        "121" : "F10",
                        "122" : "F11"
                    };

                    if ( $.inArray(keymaps[event.keyCode], disabledKeyMaps) < 0 )
                    {
                        switch (event.keyCode)
                        {
                            case 120:
                                $.proxy(toolbarHandlers["watch"], _this)();
                                return false;
                                break;

                            case 121:
                                $.proxy(toolbarHandlers["preview"], _this)();
                                return false;
                                break;

                            case 122:
                                $.proxy(toolbarHandlers["fullscreen"], _this)();
                                return false;
                                break;

                            default:
                                break;
                        }
                    }
                });
            }

            return this;
        },

        /**
         * 缁戝畾鍚屾婊氬姩
         *
         * @returns {editormd} return this
         */

        bindScrollEvent : function() {

            var _this            = this;
            var preview          = this.preview;
            var settings         = this.settings;
            var codeMirror       = this.codeMirror;
            var mouseOrTouch     = editormd.mouseOrTouch;

            if (!settings.syncScrolling) {
                return this;
            }

            var cmBindScroll = function() {
                codeMirror.find(".CodeMirror-scroll").bind(mouseOrTouch("scroll", "touchmove"), function(event) {
                    var height    = $(this).height();
                    var scrollTop = $(this).scrollTop();
                    var percent   = (scrollTop / $(this)[0].scrollHeight);

                    var tocHeight = 0;

                    preview.find(".markdown-toc-list").each(function(){
                        tocHeight += $(this).height();
                    });

                    var tocMenuHeight = preview.find(".editormd-toc-menu").height();
                    tocMenuHeight = (!tocMenuHeight) ? 0 : tocMenuHeight;

                    if (scrollTop === 0)
                    {
                        preview.scrollTop(0);
                    }
                    else if (scrollTop + height >= $(this)[0].scrollHeight - 16)
                    {
                        preview.scrollTop(preview[0].scrollHeight);
                    }
                    else
                    {
                        preview.scrollTop((preview[0].scrollHeight  + tocHeight + tocMenuHeight) * percent);
                    }

                    $.proxy(settings.onscroll, _this)(event);
                });
            };

            var cmUnbindScroll = function() {
                codeMirror.find(".CodeMirror-scroll").unbind(mouseOrTouch("scroll", "touchmove"));
            };

            var previewBindScroll = function() {

                preview.bind(mouseOrTouch("scroll", "touchmove"), function(event) {
                    var height    = $(this).height();
                    var scrollTop = $(this).scrollTop();
                    var percent   = (scrollTop / $(this)[0].scrollHeight);
                    var codeView  = codeMirror.find(".CodeMirror-scroll");

                    if(scrollTop === 0)
                    {
                        codeView.scrollTop(0);
                    }
                    else if (scrollTop + height >= $(this)[0].scrollHeight)
                    {
                        codeView.scrollTop(codeView[0].scrollHeight);
                    }
                    else
                    {
                        codeView.scrollTop(codeView[0].scrollHeight * percent);
                    }

                    $.proxy(settings.onpreviewscroll, _this)(event);
                });

            };

            var previewUnbindScroll = function() {
                preview.unbind(mouseOrTouch("scroll", "touchmove"));
            };

            codeMirror.bind({
                mouseover  : cmBindScroll,
                mouseout   : cmUnbindScroll,
                touchstart : cmBindScroll,
                touchend   : cmUnbindScroll
            });

            if (settings.syncScrolling === "single") {
                return this;
            }

            preview.bind({
                mouseover  : previewBindScroll,
                mouseout   : previewUnbindScroll,
                touchstart : previewBindScroll,
                touchend   : previewUnbindScroll
            });

            return this;
        },

        bindChangeEvent : function() {

            var _this            = this;
            var cm               = this.cm;
            var settings         = this.settings;

            if (!settings.syncScrolling) {
                return this;
            }

            cm.on("change", function(_cm, changeObj) {

                if (settings.watch)
                {
                    _this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");
                }

                timer = setTimeout(function() {
                    clearTimeout(timer);
                    _this.save();
                    timer = null;
                }, settings.delay);
            });

            return this;
        },

        /**
         * 鍔犺浇闃熷垪瀹屾垚涔嬪悗鐨勬樉绀哄鐞�
         * Display handle of the module queues loaded after.
         *
         * @param   {Boolean}   recreate   鏄惁涓洪噸寤虹紪杈戝櫒
         * @returns {editormd}             杩斿洖editormd鐨勫疄渚嬪璞�
         */

        loadedDisplay : function(recreate) {

            recreate             = recreate || false;

            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var settings         = this.settings;

            this.containerMask.hide();

            this.save();

            if (settings.watch) {
                preview.show();
            }

            editor.data("oldWidth", editor.width()).data("oldHeight", editor.height()); // 涓轰簡鍏煎Zepto

            this.resize();
            this.registerKeyMaps();

            $(window).resize(function(){
                _this.resize();
            });

            this.bindScrollEvent().bindChangeEvent();

            if (!recreate)
            {
                $.proxy(settings.onload, this)();
            }

            this.state.loaded = true;

            return this;
        },

        /**
         * 璁剧疆缂栬緫鍣ㄧ殑瀹藉害
         * Set editor width
         *
         * @param   {Number|String} width  缂栬緫鍣ㄥ搴﹀€�
         * @returns {editormd}             杩斿洖editormd鐨勫疄渚嬪璞�
         */

        width : function(width) {

            this.editor.css("width", (typeof width === "number") ? width  + "px" : width);
            this.resize();

            return this;
        },

        /**
         * 璁剧疆缂栬緫鍣ㄧ殑楂樺害
         * Set editor height
         *
         * @param   {Number|String} height  缂栬緫鍣ㄩ珮搴﹀€�
         * @returns {editormd}              杩斿洖editormd鐨勫疄渚嬪璞�
         */

        height : function(height) {

            this.editor.css("height", (typeof height === "number")  ? height  + "px" : height);
            this.resize();

            return this;
        },

        /**
         * 璋冩暣缂栬緫鍣ㄧ殑灏哄鍜屽竷灞€
         * Resize editor layout
         *
         * @param   {Number|String} [width=null]  缂栬緫鍣ㄥ搴﹀€�
         * @param   {Number|String} [height=null] 缂栬緫鍣ㄩ珮搴﹀€�
         * @returns {editormd}                    杩斿洖editormd鐨勫疄渚嬪璞�
         */

        resize : function(width, height) {

            width  = width  || null;
            height = height || null;

            var state      = this.state;
            var editor     = this.editor;
            var preview    = this.preview;
            var toolbar    = this.toolbar;
            var settings   = this.settings;
            var codeMirror = this.codeMirror;

            if (width)
            {
                editor.css("width", (typeof width  === "number") ? width  + "px" : width);
            }

            if (settings.autoHeight && !state.fullscreen && !state.preview)
            {
                editor.css("height", "auto");
                codeMirror.css("height", "auto");
            }
            else
            {
                if (height)
                {
                    editor.css("height", (typeof height === "number") ? height + "px" : height);
                }

                if (state.fullscreen)
                {
                    editor.height($(window).height());
                }

                if (settings.toolbar && !settings.readOnly)
                {
                    codeMirror.css("margin-top", toolbar.height() + 1).height(editor.height() - toolbar.height());
                }
                else
                {
                    codeMirror.css("margin-top", 0).height(editor.height());
                }
            }

            if(settings.watch)
            {
                codeMirror.width(editor.width() / 2);
                preview.width((!state.preview) ? editor.width() / 2 : editor.width());

                this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");

                if (settings.toolbar && !settings.readOnly)
                {
                    preview.css("top", toolbar.height() + 1);
                }
                else
                {
                    preview.css("top", 0);
                }

                if (settings.autoHeight && !state.fullscreen && !state.preview)
                {
                    preview.height("");
                }
                else
                {
                    var previewHeight = (settings.toolbar && !settings.readOnly) ? editor.height() - toolbar.height() : editor.height();

                    preview.height(previewHeight);
                }
            }
            else
            {
                codeMirror.width(editor.width());
                preview.hide();
            }

            if (state.loaded)
            {
                $.proxy(settings.onresize, this)();
            }

            return this;
        },

        /**
         * 瑙ｆ瀽鍜屼繚瀛楳arkdown浠ｇ爜
         * Parse & Saving Markdown source code
         *
         * @returns {editormd}     杩斿洖editormd鐨勫疄渚嬪璞�
         */

        save : function() {

            if (timer === null)
            {
                return this;
            }

            var _this            = this;
            var state            = this.state;
            var settings         = this.settings;
            var cm               = this.cm;
            var cmValue          = cm.getValue();
            var previewContainer = this.previewContainer;

            if (settings.mode !== "gfm" && settings.mode !== "markdown")
            {
                this.markdownTextarea.val(cmValue);

                return this;
            }

            var marked          = editormd.$marked;
            var markdownToC     = this.markdownToC = [];
            var rendererOptions = this.markedRendererOptions = {
                toc                  : settings.toc,
                tocm                 : settings.tocm,
                tocStartLevel        : settings.tocStartLevel,
                pageBreak            : settings.pageBreak,
                taskList             : settings.taskList,
                emoji                : settings.emoji,
                tex                  : settings.tex,
                atLink               : settings.atLink,           // for @link
                emailLink            : settings.emailLink,        // for mail address auto link
                flowChart            : settings.flowChart,
                sequenceDiagram      : settings.sequenceDiagram,
                previewCodeHighlight : settings.previewCodeHighlight,
            };

            var markedOptions = this.markedOptions = {
                renderer    : editormd.markedRenderer(markdownToC, rendererOptions),
                gfm         : true,
                tables      : true,
                breaks      : true,
                pedantic    : false,
                sanitize    : (settings.htmlDecode) ? false : true,  // 鍏抽棴蹇界暐HTML鏍囩锛屽嵆寮€鍚瘑鍒獺TML鏍囩锛岄粯璁や负false
                smartLists  : true,
                smartypants : true
            };

            marked.setOptions(markedOptions);

            var newMarkdownDoc = editormd.$marked(cmValue, markedOptions);

            //console.info("cmValue", cmValue, newMarkdownDoc);

            newMarkdownDoc = editormd.filterHTMLTags(newMarkdownDoc, settings.htmlDecode);

            //console.error("cmValue", cmValue, newMarkdownDoc);

            this.markdownTextarea.text(cmValue);

            cm.save();

            if (settings.saveHTMLToTextarea)
            {
                this.htmlTextarea.text(newMarkdownDoc);
            }

            if(settings.watch || (!settings.watch && state.preview))
            {
                previewContainer.html(newMarkdownDoc);

                this.previewCodeHighlight();

                if (settings.toc)
                {
                    var tocContainer = (settings.tocContainer === "") ? previewContainer : $(settings.tocContainer);
                    var tocMenu      = tocContainer.find("." + this.classPrefix + "toc-menu");

                    tocContainer.attr("previewContainer", (settings.tocContainer === "") ? "true" : "false");

                    if (settings.tocContainer !== "" && tocMenu.length > 0)
                    {
                        tocMenu.remove();
                    }

                    editormd.markdownToCRenderer(markdownToC, tocContainer, settings.tocDropdown, settings.tocStartLevel);

                    if (settings.tocDropdown || tocContainer.find("." + this.classPrefix + "toc-menu").length > 0)
                    {
                        editormd.tocDropdownMenu(tocContainer, (settings.tocTitle !== "") ? settings.tocTitle : this.lang.tocTitle);
                    }

                    if (settings.tocContainer !== "")
                    {
                        previewContainer.find(".markdown-toc").css("border", "none");
                    }
                }

                if (settings.tex)
                {
                    if (!editormd.kaTeXLoaded && settings.autoLoadModules)
                    {
                        editormd.loadKaTeX(function() {
                            editormd.$katex = katex;
                            editormd.kaTeXLoaded = true;
                            _this.katexRender();
                        });
                    }
                    else
                    {
                        editormd.$katex = katex;
                        this.katexRender();
                    }
                }

                if (settings.flowChart || settings.sequenceDiagram)
                {
                    flowchartTimer = setTimeout(function(){
                        clearTimeout(flowchartTimer);
                        _this.flowChartAndSequenceDiagramRender();
                        flowchartTimer = null;
                    }, 10);
                }

                if (state.loaded)
                {
                    $.proxy(settings.onchange, this)();
                }
            }

            return this;
        },

        /**
         * 鑱氱劍鍏夋爣浣嶇疆
         * Focusing the cursor position
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        focus : function() {
            this.cm.focus();

            return this;
        },

        /**
         * 璁剧疆鍏夋爣鐨勪綅缃�
         * Set cursor position
         *
         * @param   {Object}    cursor 瑕佽缃殑鍏夋爣浣嶇疆閿€煎璞★紝渚嬶細{line:1, ch:0}
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setCursor : function(cursor) {
            this.cm.setCursor(cursor);

            return this;
        },

        /**
         * 鑾峰彇褰撳墠鍏夋爣鐨勪綅缃�
         * Get the current position of the cursor
         *
         * @returns {Cursor}         杩斿洖涓€涓厜鏍嘋ursor瀵硅薄
         */

        getCursor : function() {
            return this.cm.getCursor();
        },

        /**
         * 璁剧疆鍏夋爣閫変腑鐨勮寖鍥�
         * Set cursor selected ranges
         *
         * @param   {Object}    from   寮€濮嬩綅缃殑鍏夋爣閿€煎璞★紝渚嬶細{line:1, ch:0}
         * @param   {Object}    to     缁撴潫浣嶇疆鐨勫厜鏍囬敭鍊煎璞★紝渚嬶細{line:1, ch:0}
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setSelection : function(from, to) {

            this.cm.setSelection(from, to);

            return this;
        },

        /**
         * 鑾峰彇鍏夋爣閫変腑鐨勬枃鏈�
         * Get the texts from cursor selected
         *
         * @returns {String}         杩斿洖閫変腑鏂囨湰鐨勫瓧绗︿覆褰㈠紡
         */

        getSelection : function() {
            return this.cm.getSelection();
        },

        /**
         * 璁剧疆鍏夋爣閫変腑鐨勬枃鏈寖鍥�
         * Set the cursor selection ranges
         *
         * @param   {Array}    ranges  cursor selection ranges array
         * @returns {Array}            return this
         */

        setSelections : function(ranges) {
            this.cm.setSelections(ranges);

            return this;
        },

        /**
         * 鑾峰彇鍏夋爣閫変腑鐨勬枃鏈寖鍥�
         * Get the cursor selection ranges
         *
         * @returns {Array}         return selection ranges array
         */

        getSelections : function() {
            return this.cm.getSelections();
        },

        /**
         * 鏇挎崲褰撳墠鍏夋爣閫変腑鐨勬枃鏈垨鍦ㄥ綋鍓嶅厜鏍囧鎻掑叆鏂板瓧绗�
         * Replace the text at the current cursor selected or insert a new character at the current cursor position
         *
         * @param   {String}    value  瑕佹彃鍏ョ殑瀛楃鍊�
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        replaceSelection : function(value) {
            this.cm.replaceSelection(value);

            return this;
        },

        /**
         * 鍦ㄥ綋鍓嶅厜鏍囧鎻掑叆鏂板瓧绗�
         * Insert a new character at the current cursor position
         *
         * 鍚宺eplaceSelection()鏂规硶
         * With the replaceSelection() method
         *
         * @param   {String}    value  瑕佹彃鍏ョ殑瀛楃鍊�
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        insertValue : function(value) {
            this.replaceSelection(value);

            return this;
        },

        /**
         * 杩藉姞markdown
         * append Markdown to editor
         *
         * @param   {String}    md     瑕佽拷鍔犵殑markdown婧愭枃妗�
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        appendMarkdown : function(md) {
            var settings = this.settings;
            var cm       = this.cm;

            cm.setValue(cm.getValue() + md);

            return this;
        },

        /**
         * 璁剧疆鍜屼紶鍏ョ紪杈戝櫒鐨刴arkdown婧愭枃妗�
         * Set Markdown source document
         *
         * @param   {String}    md     瑕佷紶鍏ョ殑markdown婧愭枃妗�
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setMarkdown : function(md) {
            this.cm.setValue(md || this.settings.markdown);

            return this;
        },

        /**
         * 鑾峰彇缂栬緫鍣ㄧ殑markdown婧愭枃妗�
         * Set Editor.md markdown/CodeMirror value
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        getMarkdown : function() {
            return this.cm.getValue();
        },

        /**
         * 鑾峰彇缂栬緫鍣ㄧ殑婧愭枃妗�
         * Get CodeMirror value
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        getValue : function() {
            return this.cm.getValue();
        },

        /**
         * 璁剧疆缂栬緫鍣ㄧ殑婧愭枃妗�
         * Set CodeMirror value
         *
         * @param   {String}     value   set code/value/string/text
         * @returns {editormd}           杩斿洖editormd鐨勫疄渚嬪璞�
         */

        setValue : function(value) {
            this.cm.setValue(value);

            return this;
        },

        /**
         * 娓呯┖缂栬緫鍣�
         * Empty CodeMirror editor container
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        clear : function() {
            this.cm.setValue("");

            return this;
        },

        /**
         * 鑾峰彇瑙ｆ瀽鍚庡瓨鏀惧湪Textarea鐨凥TML婧愮爜
         * Get parsed html code from Textarea
         *
         * @returns {String}               杩斿洖HTML婧愮爜
         */

        getHTML : function() {
            if (!this.settings.saveHTMLToTextarea)
            {
                alert("Error: settings.saveHTMLToTextarea == false");

                return false;
            }

            return this.htmlTextarea.val();
        },

        /**
         * getHTML()鐨勫埆鍚�
         * getHTML (alias)
         *
         * @returns {String}           Return html code 杩斿洖HTML婧愮爜
         */

        getTextareaSavedHTML : function() {
            return this.getHTML();
        },

        /**
         * 鑾峰彇棰勮绐楀彛鐨凥TML婧愮爜
         * Get html from preview container
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        getPreviewedHTML : function() {
            if (!this.settings.watch)
            {
                alert("Error: settings.watch == false");

                return false;
            }

            return this.previewContainer.html();
        },

        /**
         * 寮€鍚疄鏃堕瑙�
         * Enable real-time watching
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        watch : function(callback) {
            var settings        = this.settings;

            if ($.inArray(settings.mode, ["gfm", "markdown"]) < 0)
            {
                return this;
            }

            this.state.watching = settings.watch = true;
            this.preview.show();

            if (this.toolbar)
            {
                var watchIcon   = settings.toolbarIconsClass.watch;
                var unWatchIcon = settings.toolbarIconsClass.unwatch;

                var icon        = this.toolbar.find(".fa[name=watch]");
                icon.parent().attr("title", settings.lang.toolbar.watch);
                icon.removeClass(unWatchIcon).addClass(watchIcon);
            }

            this.codeMirror.css("border-right", "1px solid #ddd").width(this.editor.width() / 2);

            timer = 0;

            this.save().resize();

            if (!settings.onwatch)
            {
                settings.onwatch = callback || function() {};
            }

            $.proxy(settings.onwatch, this)();

            return this;
        },

        /**
         * 鍏抽棴瀹炴椂棰勮
         * Disable real-time watching
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        unwatch : function(callback) {
            var settings        = this.settings;
            this.state.watching = settings.watch = false;
            this.preview.hide();

            if (this.toolbar)
            {
                var watchIcon   = settings.toolbarIconsClass.watch;
                var unWatchIcon = settings.toolbarIconsClass.unwatch;

                var icon    = this.toolbar.find(".fa[name=watch]");
                icon.parent().attr("title", settings.lang.toolbar.unwatch);
                icon.removeClass(watchIcon).addClass(unWatchIcon);
            }

            this.codeMirror.css("border-right", "none").width(this.editor.width());

            this.resize();

            if (!settings.onunwatch)
            {
                settings.onunwatch = callback || function() {};
            }

            $.proxy(settings.onunwatch, this)();

            return this;
        },

        /**
         * 鏄剧ず缂栬緫鍣�
         * Show editor
         *
         * @param   {Function} [callback=function()] 鍥炶皟鍑芥暟
         * @returns {editormd}                       杩斿洖editormd鐨勫疄渚嬪璞�
         */

        show : function(callback) {
            callback  = callback || function() {};

            var _this = this;
            this.editor.show(0, function() {
                $.proxy(callback, _this)();
            });

            return this;
        },

        /**
         * 闅愯棌缂栬緫鍣�
         * Hide editor
         *
         * @param   {Function} [callback=function()] 鍥炶皟鍑芥暟
         * @returns {editormd}                       杩斿洖editormd鐨勫疄渚嬪璞�
         */

        hide : function(callback) {
            callback  = callback || function() {};

            var _this = this;
            this.editor.hide(0, function() {
                $.proxy(callback, _this)();
            });

            return this;
        },

        /**
         * 闅愯棌缂栬緫鍣ㄩ儴鍒嗭紝鍙瑙圚TML
         * Enter preview html state
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        previewing : function() {

            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var codeMirror       = this.codeMirror;
            var previewContainer = this.previewContainer;

            if ($.inArray(settings.mode, ["gfm", "markdown"]) < 0) {
                return this;
            }

            if (settings.toolbar && toolbar) {
                toolbar.toggle();
                toolbar.find(".fa[name=preview]").toggleClass("active");
            }

            codeMirror.toggle();

            var escHandle = function(event) {
                if (event.shiftKey && event.keyCode === 27) {
                    _this.previewed();
                }
            };

            if (codeMirror.css("display") === "none") // 涓轰簡鍏煎Zepto锛岃€屼笉浣跨敤codeMirror.is(":hidden")
            {
                this.state.preview = true;

                if (this.state.fullscreen) {
                    preview.css("background", "#fff");
                }

                editor.find("." + this.classPrefix + "preview-close-btn").show().bind(editormd.mouseOrTouch("click", "touchend"), function(){
                    _this.previewed();
                });

                if (!settings.watch)
                {
                    this.save();
                }
                else
                {
                    previewContainer.css("padding", "");
                }

                previewContainer.addClass(this.classPrefix + "preview-active");

                preview.show().css({
                    position  : "",
                    top       : 0,
                    width     : editor.width(),
                    height    : (settings.autoHeight && !this.state.fullscreen) ? "auto" : editor.height()
                });

                if (this.state.loaded)
                {
                    $.proxy(settings.onpreviewing, this)();
                }

                $(window).bind("keyup", escHandle);
            }
            else
            {
                $(window).unbind("keyup", escHandle);
                this.previewed();
            }
        },

        /**
         * 鏄剧ず缂栬緫鍣ㄩ儴鍒嗭紝閫€鍑哄彧棰勮HTML
         * Exit preview html state
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        previewed : function() {

            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var previewContainer = this.previewContainer;
            var previewCloseBtn  = editor.find("." + this.classPrefix + "preview-close-btn");

            this.state.preview   = false;

            this.codeMirror.show();

            if (settings.toolbar) {
                toolbar.show();
            }

            preview[(settings.watch) ? "show" : "hide"]();

            previewCloseBtn.hide().unbind(editormd.mouseOrTouch("click", "touchend"));

            previewContainer.removeClass(this.classPrefix + "preview-active");

            if (settings.watch)
            {
                previewContainer.css("padding", "20px");
            }

            preview.css({
                background : null,
                position   : "absolute",
                width      : editor.width() / 2,
                height     : (settings.autoHeight && !this.state.fullscreen) ? "auto" : editor.height() - toolbar.height(),
                top        : (settings.toolbar)    ? toolbar.height() : 0
            });

            if (this.state.loaded)
            {
                $.proxy(settings.onpreviewed, this)();
            }

            return this;
        },

        /**
         * 缂栬緫鍣ㄥ叏灞忔樉绀�
         * Fullscreen show
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        fullscreen : function() {

            var _this            = this;
            var state            = this.state;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var fullscreenClass  = this.classPrefix + "fullscreen";

            if (toolbar) {
                toolbar.find(".fa[name=fullscreen]").parent().toggleClass("active");
            }

            var escHandle = function(event) {
                if (!event.shiftKey && event.keyCode === 27)
                {
                    if (state.fullscreen)
                    {
                        _this.fullscreenExit();
                    }
                }
            };

            if (!editor.hasClass(fullscreenClass))
            {
                state.fullscreen = true;

                $("html,body").css("overflow", "hidden");

                editor.css({
                    width    : $(window).width(),
                    height   : $(window).height()
                }).addClass(fullscreenClass);

                this.resize();

                $.proxy(settings.onfullscreen, this)();

                $(window).bind("keyup", escHandle);
            }
            else
            {
                $(window).unbind("keyup", escHandle);
                this.fullscreenExit();
            }

            return this;
        },

        /**
         * 缂栬緫鍣ㄩ€€鍑哄叏灞忔樉绀�
         * Exit fullscreen state
         *
         * @returns {editormd}         杩斿洖editormd鐨勫疄渚嬪璞�
         */

        fullscreenExit : function() {

            var editor            = this.editor;
            var settings          = this.settings;
            var toolbar           = this.toolbar;
            var fullscreenClass   = this.classPrefix + "fullscreen";

            this.state.fullscreen = false;

            if (toolbar) {
                toolbar.find(".fa[name=fullscreen]").parent().removeClass("active");
            }

            $("html,body").css("overflow", "");

            editor.css({
                width    : editor.data("oldWidth"),
                height   : editor.data("oldHeight")
            }).removeClass(fullscreenClass);

            this.resize();

            $.proxy(settings.onfullscreenExit, this)();

            return this;
        },

        /**
         * 鍔犺浇骞舵墽琛屾彃浠�
         * Load and execute the plugin
         *
         * @param   {String}     name    plugin name / function name
         * @param   {String}     path    plugin load path
         * @returns {editormd}           杩斿洖editormd鐨勫疄渚嬪璞�
         */

        executePlugin : function(name, path) {

            var _this    = this;
            var cm       = this.cm;
            var settings = this.settings;

            path = settings.pluginPath + path;

            if (typeof define === "function")
            {
                if (typeof this[name] === "undefined")
                {
                    alert("Error: " + name + " plugin is not found, you are not load this plugin.");

                    return this;
                }

                this[name](cm);

                return this;
            }

            if ($.inArray(path, editormd.loadFiles.plugin) < 0)
            {
                editormd.loadPlugin(path, function() {
                    editormd.loadPlugins[name] = _this[name];
                    _this[name](cm);
                });
            }
            else
            {
                $.proxy(editormd.loadPlugins[name], this)(cm);
            }

            return this;
        },

        /**
         * 鎼滅储鏇挎崲
         * Search & replace
         *
         * @param   {String}     command    CodeMirror serach commands, "find, fintNext, fintPrev, clearSearch, replace, replaceAll"
         * @returns {editormd}              return this
         */

        search : function(command) {
            var settings = this.settings;

            if (!settings.searchReplace)
            {
                alert("Error: settings.searchReplace == false");
                return this;
            }

            if (!settings.readOnly)
            {
                this.cm.execCommand(command || "find");
            }

            return this;
        },

        searchReplace : function() {
            this.search("replace");

            return this;
        },

        searchReplaceAll : function() {
            this.search("replaceAll");

            return this;
        }
    };

    editormd.fn.init.prototype = editormd.fn;

    /**
     * 閿佸睆
     * lock screen when dialog opening
     *
     * @returns {void}
     */

    editormd.dialogLockScreen = function() {
        var settings = this.settings || {dialogLockScreen : true};

        if (settings.dialogLockScreen)
        {
            $("html,body").css("overflow", "hidden");
            this.resize();
        }
    };

    /**
     * 鏄剧ず閫忔槑鑳屾櫙灞�
     * Display mask layer when dialog opening
     *
     * @param   {Object}     dialog    dialog jQuery object
     * @returns {void}
     */

    editormd.dialogShowMask = function(dialog) {
        var editor   = this.editor;
        var settings = this.settings || {dialogShowMask : true};

        dialog.css({
            top  : ($(window).height() - dialog.height()) / 2 + "px",
            left : ($(window).width()  - dialog.width())  / 2 + "px"
        });

        if (settings.dialogShowMask) {
            editor.children("." + this.classPrefix + "mask").css("z-index", parseInt(dialog.css("z-index")) - 1).show();
        }
    };

    editormd.toolbarHandlers = {
        undo : function() {
            this.cm.undo();
        },

        redo : function() {
            this.cm.redo();
        },

        bold : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("**" + selection + "**");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },

        del : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("~~" + selection + "~~");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },

        italic : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("*" + selection + "*");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },

        quote : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("> " + selection);
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
            else
            {
                cm.replaceSelection("> " + selection);
            }

            //cm.replaceSelection("> " + selection);
            //cm.setCursor(cursor.line, (selection === "") ? cursor.ch + 2 : cursor.ch + selection.length + 2);
        },

        ucfirst : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(editormd.firstUpperCase(selection));
            cm.setSelections(selections);
        },

        ucwords : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(editormd.wordsFirstUpperCase(selection));
            cm.setSelections(selections);
        },

        uppercase : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(selection.toUpperCase());
            cm.setSelections(selections);
        },

        lowercase : function() {
            var cm         = this.cm;
            var cursor     = cm.getCursor();
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(selection.toLowerCase());
            cm.setSelections(selections);
        },

        h1 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("# " + selection);
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
            else
            {
                cm.replaceSelection("# " + selection);
            }
        },

        h2 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("## " + selection);
                cm.setCursor(cursor.line, cursor.ch + 3);
            }
            else
            {
                cm.replaceSelection("## " + selection);
            }
        },

        h3 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 4);
            }
            else
            {
                cm.replaceSelection("### " + selection);
            }
        },

        h4 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("#### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 5);
            }
            else
            {
                cm.replaceSelection("#### " + selection);
            }
        },

        h5 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("##### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 6);
            }
            else
            {
                cm.replaceSelection("##### " + selection);
            }
        },

        h6 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("###### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 7);
            }
            else
            {
                cm.replaceSelection("###### " + selection);
            }
        },

        "list-ul" : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (selection === "")
            {
                cm.replaceSelection("- " + selection);
            }
            else
            {
                var selectionText = selection.split("\n");

                for (var i = 0, len = selectionText.length; i < len; i++)
                {
                    selectionText[i] = (selectionText[i] === "") ? "" : "- " + selectionText[i];
                }

                cm.replaceSelection(selectionText.join("\n"));
            }
        },

        "list-ol" : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if(selection === "")
            {
                cm.replaceSelection("1. " + selection);
            }
            else
            {
                var selectionText = selection.split("\n");

                for (var i = 0, len = selectionText.length; i < len; i++)
                {
                    selectionText[i] = (selectionText[i] === "") ? "" : (i+1) + ". " + selectionText[i];
                }

                cm.replaceSelection(selectionText.join("\n"));
            }
        },

        hr : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection(((cursor.ch !== 0) ? "\n\n" : "\n") + "------------\n\n");
        },

        tex : function() {
            if (!this.settings.tex)
            {
                alert("settings.tex === false");
                return this;
            }

            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("$$" + selection + "$$");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },

        link : function() {
            this.executePlugin("linkDialog", "link-dialog/link-dialog");
        },

        "reference-link" : function() {
            this.executePlugin("referenceLinkDialog", "reference-link-dialog/reference-link-dialog");
        },

        pagebreak : function() {
            if (!this.settings.pageBreak)
            {
                alert("settings.pageBreak === false");
                return this;
            }

            var cm        = this.cm;
            var selection = cm.getSelection();

            cm.replaceSelection("\r\n[========]\r\n");
        },

        image : function() {
            this.executePlugin("imageDialog", "image-dialog/image-dialog");
        },

        code : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("`" + selection + "`");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },

        "code-block" : function() {
            this.executePlugin("codeBlockDialog", "code-block-dialog/code-block-dialog");
        },

        "preformatted-text" : function() {
            this.executePlugin("preformattedTextDialog", "preformatted-text-dialog/preformatted-text-dialog");
        },

        table : function() {
            this.executePlugin("tableDialog", "table-dialog/table-dialog");
        },

        datetime : function() {
            var cm        = this.cm;
            var selection = cm.getSelection();
            var date      = new Date();
            var langName  = this.settings.lang.name;
            var datefmt   = editormd.dateFormat() + " " + editormd.dateFormat((langName === "zh-cn" || langName === "zh-tw") ? "cn-week-day" : "week-day");

            cm.replaceSelection(datefmt);
        },

        emoji : function() {
            this.executePlugin("emojiDialog", "emoji-dialog/emoji-dialog");
        },

        "html-entities" : function() {
            this.executePlugin("htmlEntitiesDialog", "html-entities-dialog/html-entities-dialog");
        },

        "goto-line" : function() {
            this.executePlugin("gotoLineDialog", "goto-line-dialog/goto-line-dialog");
        },

        watch : function() {
            this[this.settings.watch ? "unwatch" : "watch"]();
        },

        preview : function() {
            this.previewing();
        },

        fullscreen : function() {
            this.fullscreen();
        },

        clear : function() {
            this.clear();
        },

        search : function() {
            this.search();
        },

        help : function() {
            this.executePlugin("helpDialog", "help-dialog/help-dialog");
        },

        info : function() {
            this.showInfoDialog();
        }
    };

    editormd.keyMaps = {
        "Ctrl-1"       : "h1",
        "Ctrl-2"       : "h2",
        "Ctrl-3"       : "h3",
        "Ctrl-4"       : "h4",
        "Ctrl-5"       : "h5",
        "Ctrl-6"       : "h6",
        "Ctrl-B"       : "bold",  // if this is string ==  editormd.toolbarHandlers.xxxx
        "Ctrl-D"       : "datetime",

        "Ctrl-E"       : function() { // emoji
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (!this.settings.emoji)
            {
                alert("Error: settings.emoji == false");
                return ;
            }

            cm.replaceSelection(":" + selection + ":");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        "Ctrl-Alt-G"   : "goto-line",
        "Ctrl-H"       : "hr",
        "Ctrl-I"       : "italic",
        "Ctrl-K"       : "code",

        "Ctrl-L"        : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            var title = (selection === "") ? "" : " \""+selection+"\"";

            cm.replaceSelection("[" + selection + "]("+title+")");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        "Ctrl-U"         : "list-ul",

        "Shift-Ctrl-A"   : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (!this.settings.atLink)
            {
                alert("Error: settings.atLink == false");
                return ;
            }

            cm.replaceSelection("@" + selection);

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },

        "Shift-Ctrl-C"     : "code",
        "Shift-Ctrl-Q"     : "quote",
        "Shift-Ctrl-S"     : "del",
        "Shift-Ctrl-K"     : "tex",  // KaTeX

        "Shift-Alt-C"      : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection(["```", selection, "```"].join("\n"));

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 3);
            }
        },

        "Shift-Ctrl-Alt-C" : "code-block",
        "Shift-Ctrl-H"     : "html-entities",
        "Shift-Alt-H"      : "help",
        "Shift-Ctrl-E"     : "emoji",
        "Shift-Ctrl-U"     : "uppercase",
        "Shift-Alt-U"      : "ucwords",
        "Shift-Ctrl-Alt-U" : "ucfirst",
        "Shift-Alt-L"      : "lowercase",

        "Shift-Ctrl-I"     : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            var title = (selection === "") ? "" : " \""+selection+"\"";

            cm.replaceSelection("![" + selection + "]("+title+")");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 4);
            }
        },

        "Shift-Ctrl-Alt-I" : "image",
        "Shift-Ctrl-L"     : "link",
        "Shift-Ctrl-O"     : "list-ol",
        "Shift-Ctrl-P"     : "preformatted-text",
        "Shift-Ctrl-T"     : "table",
        "Shift-Alt-P"      : "pagebreak",
        "F9"               : "watch",
        "F10"              : "preview",
        "F11"              : "fullscreen",
    };

    /**
     * 娓呴櫎瀛楃涓蹭袱杈圭殑绌烘牸
     * Clear the space of strings both sides.
     *
     * @param   {String}    str            string
     * @returns {String}                   trimed string
     */

    var trim = function(str) {
        return (!String.prototype.trim) ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") : str.trim();
    };

    editormd.trim = trim;

    /**
     * 鎵€鏈夊崟璇嶉瀛楁瘝澶у啓
     * Words first to uppercase
     *
     * @param   {String}    str            string
     * @returns {String}                   string
     */

    var ucwords = function (str) {
        return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, function($1) {
            return $1.toUpperCase();
        });
    };

    editormd.ucwords = editormd.wordsFirstUpperCase = ucwords;

    /**
     * 瀛楃涓查瀛楁瘝澶у啓
     * Only string first char to uppercase
     *
     * @param   {String}    str            string
     * @returns {String}                   string
     */

    var firstUpperCase = function(str) {
        return str.toLowerCase().replace(/\b(\w)/, function($1){
            return $1.toUpperCase();
        });
    };

    var ucfirst = firstUpperCase;

    editormd.firstUpperCase = editormd.ucfirst = firstUpperCase;

    editormd.urls = {
        atLinkBase : "https://github.com/"
    };

    editormd.regexs = {
        atLink        : /@(\w+)/g,
        email         : /(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,
        emailLink     : /(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,
        emoji         : /:([\w\+-]+):/g,
        emojiDatetime : /(\d{2}:\d{2}:\d{2})/g,
        twemoji       : /:(tw-([\w]+)-?(\w+)?):/g,
        fontAwesome   : /:(fa-([\w]+)(-(\w+)){0,}):/g,
        editormdLogo  : /:(editormd-logo-?(\w+)?):/g,
        pageBreak     : /^\[[=]{8,}\]$/
    };

    // Emoji graphics files url path
    editormd.emoji     = {
        path  : "http://www.emoji-cheat-sheet.com/graphics/emojis/",
        ext   : ".png"
    };

    // Twitter Emoji (Twemoji)  graphics files url path
    editormd.twemoji = {
        path : "http://twemoji.maxcdn.com/36x36/",
        ext  : ".png"
    };

    /**
     * 鑷畾涔塵arked鐨勮В鏋愬櫒
     * Custom Marked renderer rules
     *
     * @param   {Array}    markdownToC     浼犲叆鐢ㄤ簬鎺ユ敹TOC鐨勬暟缁�
     * @returns {Renderer} markedRenderer  杩斿洖marked鐨凴enderer鑷畾涔夊璞�
     */

    editormd.markedRenderer = function(markdownToC, options) {
        var defaults = {
            toc                  : true,           // Table of contents
            tocm                 : false,
            tocStartLevel        : 1,              // Said from H1 to create ToC
            pageBreak            : true,
            atLink               : true,           // for @link
            emailLink            : true,           // for mail address auto link
            taskList             : false,          // Enable Github Flavored Markdown task lists
            emoji                : false,          // :emoji: , Support Twemoji, fontAwesome, Editor.md logo emojis.
            tex                  : false,          // TeX(LaTeX), based on KaTeX
            flowChart            : false,          // flowChart.js only support IE9+
            sequenceDiagram      : false,          // sequenceDiagram.js only support IE9+
        };

        var settings        = $.extend(defaults, options || {});
        var marked          = editormd.$marked;
        var markedRenderer  = new marked.Renderer();
        markdownToC         = markdownToC || [];

        var regexs          = editormd.regexs;
        var atLinkReg       = regexs.atLink;
        var emojiReg        = regexs.emoji;
        var emailReg        = regexs.email;
        var emailLinkReg    = regexs.emailLink;
        var twemojiReg      = regexs.twemoji;
        var faIconReg       = regexs.fontAwesome;
        var editormdLogoReg = regexs.editormdLogo;
        var pageBreakReg    = regexs.pageBreak;

        markedRenderer.emoji = function(text) {

            text = text.replace(editormd.regexs.emojiDatetime, function($1) {
                return $1.replace(/:/g, "&#58;");
            });

            var matchs = text.match(emojiReg);

            if (!matchs || !settings.emoji) {
                return text;
            }

            for (var i = 0, len = matchs.length; i < len; i++)
            {
                if (matchs[i] === ":+1:") {
                    matchs[i] = ":\\+1:";
                }

                text = text.replace(new RegExp(matchs[i]), function($1, $2){
                    var faMatchs = $1.match(faIconReg);
                    var name     = $1.replace(/:/g, "");

                    if (faMatchs)
                    {
                        for (var fa = 0, len1 = faMatchs.length; fa < len1; fa++)
                        {
                            var faName = faMatchs[fa].replace(/:/g, "");

                            return "<i class=\"fa " + faName + " fa-emoji\" title=\"" + faName.replace("fa-", "") + "\"></i>";
                        }
                    }
                    else
                    {
                        var emdlogoMathcs = $1.match(editormdLogoReg);
                        var twemojiMatchs = $1.match(twemojiReg);

                        if (emdlogoMathcs)
                        {
                            for (var x = 0, len2 = emdlogoMathcs.length; x < len2; x++)
                            {
                                var logoName = emdlogoMathcs[x].replace(/:/g, "");
                                return "<i class=\"" + logoName + "\" title=\"Editor.md logo (" + logoName + ")\"></i>";
                            }
                        }
                        else if (twemojiMatchs)
                        {
                            for (var t = 0, len3 = twemojiMatchs.length; t < len3; t++)
                            {
                                var twe = twemojiMatchs[t].replace(/:/g, "").replace("tw-", "");
                                return "<img src=\"" + editormd.twemoji.path + twe + editormd.twemoji.ext + "\" title=\"twemoji-" + twe + "\" alt=\"twemoji-" + twe + "\" class=\"emoji twemoji\" />";
                            }
                        }
                        else
                        {
                            var src = (name === "+1") ? "plus1" : name;
                            src     = (src === "black_large_square") ? "black_square" : src;
                            src     = (src === "moon") ? "waxing_gibbous_moon" : src;

                            return "<img src=\"" + editormd.emoji.path + src + editormd.emoji.ext + "\" class=\"emoji\" title=\"&#58;" + name + "&#58;\" alt=\"&#58;" + name + "&#58;\" />";
                        }
                    }
                });
            }

            return text;
        };

        markedRenderer.atLink = function(text) {

            if (atLinkReg.test(text))
            {
                if (settings.atLink)
                {
                    text = text.replace(emailReg, function($1, $2, $3, $4) {
                        return $1.replace(/@/g, "_#_&#64;_#_");
                    });

                    text = text.replace(atLinkReg, function($1, $2) {
                        return "<a href=\"" + editormd.urls.atLinkBase + "" + $2 + "\" title=\"&#64;" + $2 + "\" class=\"at-link\">" + $1 + "</a>";
                    }).replace(/_#_&#64;_#_/g, "@");
                }

                if (settings.emailLink)
                {
                    text = text.replace(emailLinkReg, function($1, $2, $3, $4, $5) {
                        return (!$2 && $.inArray($5, "jpg|jpeg|png|gif|webp|ico|icon|pdf".split("|")) < 0) ? "<a href=\"mailto:" + $1 + "\">"+$1+"</a>" : $1;
                    });
                }

                return text;
            }

            return text;
        };

        markedRenderer.link = function (href, title, text) {

            if (this.options.sanitize) {
                try {
                    var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase();
                } catch(e) {
                    return "";
                }

                if (prot.indexOf("javascript:") === 0) {
                    return "";
                }
            }

            var out = "<a href=\"" + href + "\"";

            if (atLinkReg.test(title) || atLinkReg.test(text))
            {
                if (title)
                {
                    out += " title=\"" + title.replace(/@/g, "&#64;");
                }

                return out + "\">" + text.replace(/@/g, "&#64;") + "</a>";
            }

            if (title) {
                out += " title=\"" + title + "\"";
            }

            out += ">" + text + "</a>";

            return out;
        };

        markedRenderer.heading = function(text, level, raw) {

            var linkText       = text;
            var hasLinkReg     = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
            var getLinkTextReg = /\s*\<a\s*([^\>]+)\>([^\>]*)\<\/a\>\s*/g;

            if (hasLinkReg.test(text))
            {
                var tempText = [];
                text         = text.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);

                for (var i = 0, len = text.length; i < len; i++)
                {
                    tempText.push(text[i].replace(/\s*href\=\"(.*)\"\s*/g, ""));
                }

                text = tempText.join(" ");
            }

            text = trim(text);

            var escapedText    = text.toLowerCase().replace(/[^\w]+/g, "-");
            var toc = {
                text  : text,
                level : level,
                slug  : escapedText
            };

            var isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
            var id        = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");

            markdownToC.push(toc);

            var headingHTML = "<h" + level + " id=\"h"+ level + "-" + this.options.headerPrefix + id +"\">";

            headingHTML    += "<a name=\"" + text + "\" class=\"reference-link\"></a>";
            headingHTML    += "<span class=\"header-link octicon octicon-link\"></span>";
            headingHTML    += (hasLinkReg) ? this.atLink(this.emoji(linkText)) : this.atLink(this.emoji(text));
            headingHTML    += "</h" + level + ">";

            return headingHTML;
        };

        markedRenderer.pageBreak = function(text) {
            if (pageBreakReg.test(text) && settings.pageBreak)
            {
                text = "<hr style=\"page-break-after:always;\" class=\"page-break editormd-page-break\" />";
            }

            return text;
        };

        markedRenderer.paragraph = function(text) {
            var isTeXInline     = /\$\$(.*)\$\$/g.test(text);
            var isTeXLine       = /^\$\$(.*)\$\$$/.test(text);
            var isTeXAddClass   = (isTeXLine)     ? " class=\"" + editormd.classNames.tex + "\"" : "";
            var isToC           = (settings.tocm) ? /^(\[TOC\]|\[TOCM\])$/.test(text) : /^\[TOC\]$/.test(text);
            var isToCMenu       = /^\[TOCM\]$/.test(text);

            if (!isTeXLine && isTeXInline)
            {
                text = text.replace(/(\$\$([^\$]*)\$\$)+/g, function($1, $2) {
                    return "<span class=\"" + editormd.classNames.tex + "\">" + $2.replace(/\$/g, "") + "</span>";
                });
            }
            else
            {
                text = (isTeXLine) ? text.replace(/\$/g, "") : text;
            }

            var tocHTML = "<div class=\"markdown-toc editormd-markdown-toc\">" + text + "</div>";

            return (isToC) ? ( (isToCMenu) ? "<div class=\"editormd-toc-menu\">" + tocHTML + "</div><br/>" : tocHTML )
                : ( (pageBreakReg.test(text)) ? this.pageBreak(text) : "<p" + isTeXAddClass + ">" + this.atLink(this.emoji(text)) + "</p>\n" );
        };

        markedRenderer.code = function (code, lang, escaped) {

            if (lang === "seq" || lang === "sequence")
            {
                return "<div class=\"sequence-diagram\">" + code + "</div>";
            }
            else if ( lang === "flow")
            {
                return "<div class=\"flowchart\">" + code + "</div>";
            }
            else if ( lang === "math" || lang === "latex" || lang === "katex")
            {
                return "<p class=\"" + editormd.classNames.tex + "\">" + code + "</p>";
            }
            else
            {

                return marked.Renderer.prototype.code.apply(this, arguments);
            }
        };

        markedRenderer.tablecell = function(content, flags) {
            var type = (flags.header) ? "th" : "td";
            var tag  = (flags.align)  ? "<" + type +" style=\"text-align:" + flags.align + "\">" : "<" + type + ">";

            return tag + this.atLink(this.emoji(content)) + "</" + type + ">\n";
        };

        markedRenderer.listitem = function(text) {
            if (settings.taskList && /^\s*\[[x\s]\]\s*/.test(text))
            {
                text = text.replace(/^\s*\[\s\]\s*/, "<input type=\"checkbox\" class=\"task-list-item-checkbox\" /> ")
                    .replace(/^\s*\[x\]\s*/,  "<input type=\"checkbox\" class=\"task-list-item-checkbox\" checked disabled /> ");

                return "<li style=\"list-style: none;\">" + this.atLink(this.emoji(text)) + "</li>";
            }
            else
            {
                return "<li>" + this.atLink(this.emoji(text)) + "</li>";
            }
        };

        return markedRenderer;
    };

    /**
     *
     * 鐢熸垚TOC(Table of Contents)
     * Creating ToC (Table of Contents)
     *
     * @param   {Array}    toc             浠巑arked鑾峰彇鐨凾OC鏁扮粍鍒楄〃
     * @param   {Element}  container       鎻掑叆TOC鐨勫鍣ㄥ厓绱�
     * @param   {Integer}  startLevel      Hx 璧峰灞傜骇
     * @returns {Object}   tocContainer    杩斿洖ToC鍒楄〃瀹瑰櫒灞傜殑jQuery瀵硅薄鍏冪礌
     */

    editormd.markdownToCRenderer = function(toc, container, tocDropdown, startLevel) {

        var html        = "";
        var lastLevel   = 0;
        var classPrefix = this.classPrefix;

        startLevel      = startLevel  || 1;

        for (var i = 0, len = toc.length; i < len; i++)
        {
            var text  = toc[i].text;
            var level = toc[i].level;

            if (level < startLevel) {
                continue;
            }

            if (level > lastLevel)
            {
                html += "";
            }
            else if (level < lastLevel)
            {
                html += (new Array(lastLevel - level + 2)).join("</ul></li>");
            }
            else
            {
                html += "</ul></li>";
            }

            html += "<li><a class=\"toc-level-" + level + "\" href=\"#" + text + "\" level=\"" + level + "\">" + text + "</a><ul>";
            lastLevel = level;
        }

        var tocContainer = container.find(".markdown-toc");

        if ((tocContainer.length < 1 && container.attr("previewContainer") === "false"))
        {
            var tocHTML = "<div class=\"markdown-toc " + classPrefix + "markdown-toc\"></div>";

            tocHTML = (tocDropdown) ? "<div class=\"" + classPrefix + "toc-menu\">" + tocHTML + "</div>" : tocHTML;

            container.html(tocHTML);

            tocContainer = container.find(".markdown-toc");
        }

        if (tocDropdown)
        {
            tocContainer.wrap("<div class=\"" + classPrefix + "toc-menu\"></div><br/>");
        }

        tocContainer.html("<ul class=\"markdown-toc-list\"></ul>").children(".markdown-toc-list").html(html.replace(/\r?\n?\<ul\>\<\/ul\>/g, ""));

        return tocContainer;
    };

    /**
     *
     * 鐢熸垚TOC涓嬫媺鑿滃崟
     * Creating ToC dropdown menu
     *
     * @param   {Object}   container       鎻掑叆TOC鐨勫鍣╦Query瀵硅薄鍏冪礌
     * @param   {String}   tocTitle        ToC title
     * @returns {Object}                   return toc-menu object
     */

    editormd.tocDropdownMenu = function(container, tocTitle) {

        tocTitle      = tocTitle || "Table of Contents";

        var zindex    = 400;
        var tocMenus  = container.find("." + this.classPrefix + "toc-menu");

        tocMenus.each(function() {
            var $this  = $(this);
            var toc    = $this.children(".markdown-toc");
            var icon   = "<i class=\"fa fa-angle-down\"></i>";
            var btn    = "<a href=\"javascript:;\" class=\"toc-menu-btn\">" + icon + tocTitle + "</a>";
            var menu   = toc.children("ul");
            var list   = menu.find("li");

            toc.append(btn);

            list.first().before("<li><h1>" + tocTitle + " " + icon + "</h1></li>");

            $this.mouseover(function(){
                menu.show();

                list.each(function(){
                    var li = $(this);
                    var ul = li.children("ul");

                    if (ul.html() === "")
                    {
                        ul.remove();
                    }

                    if (ul.length > 0 && ul.html() !== "")
                    {
                        var firstA = li.children("a").first();

                        if (firstA.children(".fa").length < 1)
                        {
                            firstA.append( $(icon).css({ float:"right", paddingTop:"4px" }) );
                        }
                    }

                    li.mouseover(function(){
                        ul.css("z-index", zindex).show();
                        zindex += 1;
                    }).mouseleave(function(){
                        ul.hide();
                    });
                });
            }).mouseleave(function(){
                menu.hide();
            });
        });

        return tocMenus;
    };

    /**
     * 绠€鍗曞湴杩囨护鎸囧畾鐨凥TML鏍囩
     * Filter custom html tags
     *
     * @param   {String}   html          瑕佽繃婊TML
     * @param   {String}   filters       瑕佽繃婊ょ殑鏍囩
     * @returns {String}   html          杩斿洖杩囨护鐨凥TML
     */

    editormd.filterHTMLTags = function(html, filters) {

        if (typeof html !== "string") {
            html = new String(html);
        }

        if (typeof filters !== "string") {
            return html;
        }

        var expression = filters.split("|");
        var filterTags = expression[0].split(",");
        var attrs      = expression[1];

        for (var i = 0, len = filterTags.length; i < len; i++)
        {
            var tag = filterTags[i];

            html = html.replace(new RegExp("\<\s*" + tag + "\s*([^\>]*)\>([^\>]*)\<\s*\/" + tag + "\s*\>", "igm"), "");
        }

        //return html;

        if (typeof attrs !== "undefined")
        {
            var htmlTagRegex = /\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/ig;

            if (attrs === "*")
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                    return "<" + $2 + ">" + $4 + "</" + $5 + ">";
                });
            }
            else if (attrs === "on*")
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                    var el = $("<" + $2 + ">" + $4 + "</" + $5 + ">");
                    var _attrs = $($1)[0].attributes;
                    var $attrs = {};

                    $.each(_attrs, function(i, e) {
                        if (e.nodeName !== '"') $attrs[e.nodeName] = e.nodeValue;
                    });

                    $.each($attrs, function(i) {
                        if (i.indexOf("on") === 0) {
                            delete $attrs[i];
                        }
                    });

                    el.attr($attrs);

                    var text = (typeof el[1] !== "undefined") ? $(el[1]).text() : "";

                    return el[0].outerHTML + text;
                });
            }
            else
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4) {
                    var filterAttrs = attrs.split(",");
                    var el = $($1);
                    el.html($4);

                    $.each(filterAttrs, function(i) {
                        el.attr(filterAttrs[i], null);
                    });

                    return el[0].outerHTML;
                });
            }
        }

        return html;
    };

    /**
     * 灏哅arkdown鏂囨。瑙ｆ瀽涓篐TML鐢ㄤ簬鍓嶅彴鏄剧ず
     * Parse Markdown to HTML for Font-end preview.
     *
     * @param   {String}   id            鐢ㄤ簬鏄剧ずHTML鐨勫璞D
     * @param   {Object}   [options={}]  閰嶇疆閫夐」锛屽彲閫�
     * @returns {Object}   div           杩斿洖jQuery瀵硅薄鍏冪礌
     */

    editormd.markdownToHTML = function(id, options) {
        var defaults = {
            gfm                  : true,
            toc                  : true,
            tocm                 : false,
            tocStartLevel        : 1,
            tocTitle             : "鐩綍",
            tocDropdown          : false,
            tocContainer         : "",
            markdown             : "",
            markdownSourceCode   : false,
            htmlDecode           : false,
            autoLoadKaTeX        : true,
            pageBreak            : true,
            atLink               : true,    // for @link
            emailLink            : true,    // for mail address auto link
            tex                  : false,
            taskList             : false,   // Github Flavored Markdown task lists
            emoji                : false,
            flowChart            : false,
            sequenceDiagram      : false,
            previewCodeHighlight : true
        };

        editormd.$marked  = marked;

        var div           = $("#" + id);
        var settings      = div.settings = $.extend(true, defaults, options || {});
        var saveTo        = div.find("textarea");

        if (saveTo.length < 1)
        {
            div.append("<textarea></textarea>");
            saveTo        = div.find("textarea");
        }

        var markdownDoc   = (settings.markdown === "") ? saveTo.val() : settings.markdown;
        var markdownToC   = [];

        var rendererOptions = {
            toc                  : settings.toc,
            tocm                 : settings.tocm,
            tocStartLevel        : settings.tocStartLevel,
            taskList             : settings.taskList,
            emoji                : settings.emoji,
            tex                  : settings.tex,
            pageBreak            : settings.pageBreak,
            atLink               : settings.atLink,           // for @link
            emailLink            : settings.emailLink,        // for mail address auto link
            flowChart            : settings.flowChart,
            sequenceDiagram      : settings.sequenceDiagram,
            previewCodeHighlight : settings.previewCodeHighlight,
        };

        var markedOptions = {
            renderer    : editormd.markedRenderer(markdownToC, rendererOptions),
            gfm         : settings.gfm,
            tables      : true,
            breaks      : true,
            pedantic    : false,
            sanitize    : (settings.htmlDecode) ? false : true, // 鏄惁蹇界暐HTML鏍囩锛屽嵆鏄惁寮€鍚疕TML鏍囩瑙ｆ瀽锛屼负浜嗗畨鍏ㄦ€э紝榛樿涓嶅紑鍚�
            smartLists  : true,
            smartypants : true
        };

        markdownDoc = new String(markdownDoc);

        var markdownParsed = marked(markdownDoc, markedOptions);

        markdownParsed = editormd.filterHTMLTags(markdownParsed, settings.htmlDecode);

        if (settings.markdownSourceCode) {
            saveTo.text(markdownDoc);
        } else {
            saveTo.remove();
        }

        div.addClass("markdown-body " + this.classPrefix + "html-preview").append(markdownParsed);

        var tocContainer = (settings.tocContainer !== "") ? $(settings.tocContainer) : div;

        if (settings.tocContainer !== "")
        {
            tocContainer.attr("previewContainer", false);
        }

        if (settings.toc)
        {
            div.tocContainer = this.markdownToCRenderer(markdownToC, tocContainer, settings.tocDropdown, settings.tocStartLevel);

            if (settings.tocDropdown || div.find("." + this.classPrefix + "toc-menu").length > 0)
            {
                this.tocDropdownMenu(div, settings.tocTitle);
            }

            if (settings.tocContainer !== "")
            {
                div.find(".editormd-toc-menu, .editormd-markdown-toc").remove();
            }
        }

        if (settings.previewCodeHighlight)
        {
            div.find("pre").addClass("prettyprint linenums");
            prettyPrint();
        }

        if (!editormd.isIE8)
        {
            if (settings.flowChart) {
                div.find(".flowchart").flowChart();
            }

            if (settings.sequenceDiagram) {
                div.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }
        }

        if (settings.tex)
        {
            var katexHandle = function() {
                div.find("." + editormd.classNames.tex).each(function(){
                    var tex  = $(this);
                    katex.render(tex.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">"), tex[0]);
                    tex.find(".katex").css("font-size", "1.6em");
                });
            };

            if (settings.autoLoadKaTeX && !editormd.$katex && !editormd.kaTeXLoaded)
            {
                this.loadKaTeX(function() {
                    editormd.$katex      = katex;
                    editormd.kaTeXLoaded = true;
                    katexHandle();
                });
            }
            else
            {
                katexHandle();
            }
        }

        div.getMarkdown = function() {
            return saveTo.val();
        };

        return div;
    };

    // Editor.md themes, change toolbar themes etc.
    // added @1.5.0
    editormd.themes        = ["default", "dark"];

    // Preview area themes
    // added @1.5.0
    editormd.previewThemes = ["default", "dark"];

    // CodeMirror / editor area themes
    // @1.5.0 rename -> editorThemes, old version -> themes
    editormd.editorThemes = [
        "default", "3024-day", "3024-night",
        "ambiance", "ambiance-mobile",
        "base16-dark", "base16-light", "blackboard",
        "cobalt",
        "eclipse", "elegant", "erlang-dark",
        "lesser-dark",
        "mbo", "mdn-like", "midnight", "monokai",
        "neat", "neo", "night",
        "paraiso-dark", "paraiso-light", "pastel-on-dark",
        "rubyblue",
        "solarized",
        "the-matrix", "tomorrow-night-eighties", "twilight",
        "vibrant-ink",
        "xq-dark", "xq-light"
    ];

    editormd.loadPlugins = {};

    editormd.loadFiles = {
        js     : [],
        css    : [],
        plugin : []
    };

    /**
     * 鍔ㄦ€佸姞杞紼ditor.md鎻掍欢锛屼絾涓嶇珛鍗虫墽琛�
     * Load editor.md plugins
     *
     * @param {String}   fileName              鎻掍欢鏂囦欢璺緞
     * @param {Function} [callback=function()] 鍔犺浇鎴愬姛鍚庢墽琛岀殑鍥炶皟鍑芥暟
     * @param {String}   [into="head"]         宓屽叆椤甸潰鐨勪綅缃�
     */

    editormd.loadPlugin = function(fileName, callback, into) {
        callback   = callback || function() {};

        this.loadScript(fileName, function() {
            editormd.loadFiles.plugin.push(fileName);
            callback();
        }, into);
    };

    /**
     * 鍔ㄦ€佸姞杞紺SS鏂囦欢鐨勬柟娉�
     * Load css file method
     *
     * @param {String}   fileName              CSS鏂囦欢鍚�
     * @param {Function} [callback=function()] 鍔犺浇鎴愬姛鍚庢墽琛岀殑鍥炶皟鍑芥暟
     * @param {String}   [into="head"]         宓屽叆椤甸潰鐨勪綅缃�
     */

    editormd.loadCSS   = function(fileName, callback, into) {
        into       = into     || "head";
        callback   = callback || function() {};

        var css    = document.createElement("link");
        css.type   = "text/css";
        css.rel    = "stylesheet";
        css.onload = css.onreadystatechange = function() {
            editormd.loadFiles.css.push(fileName);
            callback();
        };

        css.href   = fileName + ".css";

        if(into === "head") {
            document.getElementsByTagName("head")[0].appendChild(css);
        } else {
            document.body.appendChild(css);
        }
    };

    editormd.isIE    = (navigator.appName == "Microsoft Internet Explorer");
    editormd.isIE8   = (editormd.isIE && navigator.appVersion.match(/8./i) == "8.");

    /**
     * 鍔ㄦ€佸姞杞絁S鏂囦欢鐨勬柟娉�
     * Load javascript file method
     *
     * @param {String}   fileName              JS鏂囦欢鍚�
     * @param {Function} [callback=function()] 鍔犺浇鎴愬姛鍚庢墽琛岀殑鍥炶皟鍑芥暟
     * @param {String}   [into="head"]         宓屽叆椤甸潰鐨勪綅缃�
     */

    editormd.loadScript = function(fileName, callback, into) {

        into          = into     || "head";
        callback      = callback || function() {};

        var script    = null;
        script        = document.createElement("script");
        script.id     = fileName.replace(/[\./]+/g, "-");
        script.type   = "text/javascript";
        script.src    = fileName + ".js";

        if (editormd.isIE8)
        {
            script.onreadystatechange = function() {
                if(script.readyState)
                {
                    if (script.readyState === "loaded" || script.readyState === "complete")
                    {
                        script.onreadystatechange = null;
                        editormd.loadFiles.js.push(fileName);
                        callback();
                    }
                }
            };
        }
        else
        {
            script.onload = function() {
                editormd.loadFiles.js.push(fileName);
                callback();
            };
        }

        if (into === "head") {
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            document.body.appendChild(script);
        }
    };

    // 浣跨敤鍥藉鐨凜DN锛屽姞杞介€熷害鏈夋椂浼氬緢鎱紝鎴栬€呰嚜瀹氫箟URL
    // You can custom KaTeX load url.
    editormd.katexURL  = {
        css : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min",
        js  : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min"
    };

    editormd.kaTeXLoaded = false;

    /**
     * 鍔犺浇KaTeX鏂囦欢
     * load KaTeX files
     *
     * @param {Function} [callback=function()]  鍔犺浇鎴愬姛鍚庢墽琛岀殑鍥炶皟鍑芥暟
     */

    editormd.loadKaTeX = function (callback) {
        editormd.loadCSS(editormd.katexURL.css, function(){
            editormd.loadScript(editormd.katexURL.js, callback || function(){});
        });
    };

    /**
     * 閿佸睆
     * lock screen
     *
     * @param   {Boolean}   lock   Boolean 甯冨皵鍊硷紝鏄惁閿佸睆
     * @returns {void}
     */

    editormd.lockScreen = function(lock) {
        $("html,body").css("overflow", (lock) ? "hidden" : "");
    };

    /**
     * 鍔ㄦ€佸垱寤哄璇濇
     * Creating custom dialogs
     *
     * @param   {Object} options 閰嶇疆椤归敭鍊煎 Key/Value
     * @returns {dialog} 杩斿洖鍒涘缓鐨刣ialog鐨刯Query瀹炰緥瀵硅薄
     */

    editormd.createDialog = function(options) {
        var defaults = {
            name : "",
            width : 420,
            height: 240,
            title : "",
            drag  : true,
            closed : true,
            content : "",
            mask : true,
            maskStyle : {
                backgroundColor : "#fff",
                opacity : 0.1
            },
            lockScreen : true,
            footer : true,
            buttons : false
        };

        options          = $.extend(true, defaults, options);

        var $this        = this;
        var editor       = this.editor;
        var classPrefix  = editormd.classPrefix;
        var guid         = (new Date()).getTime();
        var dialogName   = ( (options.name === "") ? classPrefix + "dialog-" + guid : options.name);
        var mouseOrTouch = editormd.mouseOrTouch;

        var html         = "<div class=\"" + classPrefix + "dialog " + dialogName + "\">";

        if (options.title !== "")
        {
            html += "<div class=\"" + classPrefix + "dialog-header\"" + ( (options.drag) ? " style=\"cursor: move;\"" : "" ) + ">";
            html += "<strong class=\"" + classPrefix + "dialog-title\">" + options.title + "</strong>";
            html += "</div>";
        }

        if (options.closed)
        {
            html += "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>";
        }

        html += "<div class=\"" + classPrefix + "dialog-container\">" + options.content;

        if (options.footer || typeof options.footer === "string")
        {
            html += "<div class=\"" + classPrefix + "dialog-footer\">" + ( (typeof options.footer === "boolean") ? "" : options.footer) + "</div>";
        }

        html += "</div>";

        html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-bg\"></div>";
        html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-con\"></div>";
        html += "</div>";

        editor.append(html);

        var dialog = editor.find("." + dialogName);

        dialog.lockScreen = function(lock) {
            if (options.lockScreen)
            {
                $("html,body").css("overflow", (lock) ? "hidden" : "");
                $this.resize();
            }

            return dialog;
        };

        dialog.showMask = function() {
            if (options.mask)
            {
                editor.find("." + classPrefix + "mask").css(options.maskStyle).css("z-index", editormd.dialogZindex - 1).show();
            }
            return dialog;
        };

        dialog.hideMask = function() {
            if (options.mask)
            {
                editor.find("." + classPrefix + "mask").hide();
            }

            return dialog;
        };

        dialog.loading = function(show) {
            var loading = dialog.find("." + classPrefix + "dialog-mask");
            loading[(show) ? "show" : "hide"]();

            return dialog;
        };

        dialog.lockScreen(true).showMask();

        dialog.show().css({
            zIndex : editormd.dialogZindex,
            border : (editormd.isIE8) ? "1px solid #ddd" : "",
            width  : (typeof options.width  === "number") ? options.width + "px"  : options.width,
            height : (typeof options.height === "number") ? options.height + "px" : options.height
        });

        var dialogPosition = function(){
            dialog.css({
                top    : ($(window).height() - dialog.height()) / 2 + "px",
                left   : ($(window).width() - dialog.width()) / 2 + "px"
            });
        };

        dialogPosition();

        $(window).resize(dialogPosition);

        dialog.children("." + classPrefix + "dialog-close").bind(mouseOrTouch("click", "touchend"), function() {
            dialog.hide().lockScreen(false).hideMask();
        });

        if (typeof options.buttons === "object")
        {
            var footer = dialog.footer = dialog.find("." + classPrefix + "dialog-footer");

            for (var key in options.buttons)
            {
                var btn = options.buttons[key];
                var btnClassName = classPrefix + key + "-btn";

                footer.append("<button class=\"" + classPrefix + "btn " + btnClassName + "\">" + btn[0] + "</button>");
                btn[1] = $.proxy(btn[1], dialog);
                footer.children("." + btnClassName).bind(mouseOrTouch("click", "touchend"), btn[1]);
            }
        }

        if (options.title !== "" && options.drag)
        {
            var posX, posY;
            var dialogHeader = dialog.children("." + classPrefix + "dialog-header");

            if (!options.mask) {
                dialogHeader.bind(mouseOrTouch("click", "touchend"), function(){
                    editormd.dialogZindex += 2;
                    dialog.css("z-index", editormd.dialogZindex);
                });
            }

            dialogHeader.mousedown(function(e) {
                e = e || window.event;  //IE
                posX = e.clientX - parseInt(dialog[0].style.left);
                posY = e.clientY - parseInt(dialog[0].style.top);

                document.onmousemove = moveAction;
            });

            var userCanSelect = function (obj) {
                obj.removeClass(classPrefix + "user-unselect").off("selectstart");
            };

            var userUnselect = function (obj) {
                obj.addClass(classPrefix + "user-unselect").on("selectstart", function(event) { // selectstart for IE
                    return false;
                });
            };

            var moveAction = function (e) {
                e = e || window.event;  //IE

                var left, top, nowLeft = parseInt(dialog[0].style.left), nowTop = parseInt(dialog[0].style.top);

                if( nowLeft >= 0 ) {
                    if( nowLeft + dialog.width() <= $(window).width()) {
                        left = e.clientX - posX;
                    } else {
                        left = $(window).width() - dialog.width();
                        document.onmousemove = null;
                    }
                } else {
                    left = 0;
                    document.onmousemove = null;
                }

                if( nowTop >= 0 ) {
                    top = e.clientY - posY;
                } else {
                    top = 0;
                    document.onmousemove = null;
                }


                document.onselectstart = function() {
                    return false;
                };

                userUnselect($("body"));
                userUnselect(dialog);
                dialog[0].style.left = left + "px";
                dialog[0].style.top  = top + "px";
            };

            document.onmouseup = function() {
                userCanSelect($("body"));
                userCanSelect(dialog);

                document.onselectstart = null;
                document.onmousemove = null;
            };

            dialogHeader.touchDraggable = function() {
                var offset = null;
                var start  = function(e) {
                    var orig = e.originalEvent;
                    var pos  = $(this).parent().position();

                    offset = {
                        x : orig.changedTouches[0].pageX - pos.left,
                        y : orig.changedTouches[0].pageY - pos.top
                    };
                };

                var move = function(e) {
                    e.preventDefault();
                    var orig = e.originalEvent;

                    $(this).parent().css({
                        top  : orig.changedTouches[0].pageY - offset.y,
                        left : orig.changedTouches[0].pageX - offset.x
                    });
                };

                this.bind("touchstart", start).bind("touchmove", move);
            };

            dialogHeader.touchDraggable();
        }

        editormd.dialogZindex += 2;

        return dialog;
    };

    /**
     * 榧犳爣鍜岃Е鎽镐簨浠剁殑鍒ゆ柇/閫夋嫨鏂规硶
     * MouseEvent or TouchEvent type switch
     *
     * @param   {String} [mouseEventType="click"]    渚涢€夋嫨鐨勯紶鏍囦簨浠�
     * @param   {String} [touchEventType="touchend"] 渚涢€夋嫨鐨勮Е鎽镐簨浠�
     * @returns {String} EventType                   杩斿洖浜嬩欢绫诲瀷鍚嶇О
     */

    editormd.mouseOrTouch = function(mouseEventType, touchEventType) {
        mouseEventType = mouseEventType || "click";
        touchEventType = touchEventType || "touchend";

        var eventType  = mouseEventType;

        try {
            document.createEvent("TouchEvent");
            eventType = touchEventType;
        } catch(e) {}

        return eventType;
    };

    /**
     * 鏃ユ湡鏃堕棿鐨勬牸寮忓寲鏂规硶
     * Datetime format method
     *
     * @param   {String}   [format=""]  鏃ユ湡鏃堕棿鐨勬牸寮忥紝绫讳技PHP鐨勬牸寮�
     * @returns {String}   datefmt      杩斿洖鏍煎紡鍖栧悗鐨勬棩鏈熸椂闂村瓧绗︿覆
     */

    editormd.dateFormat = function(format) {
        format      = format || "";

        var addZero = function(d) {
            return (d < 10) ? "0" + d : d;
        };

        var date    = new Date();
        var year    = date.getFullYear();
        var year2   = year.toString().slice(2, 4);
        var month   = addZero(date.getMonth() + 1);
        var day     = addZero(date.getDate());
        var weekDay = date.getDay();
        var hour    = addZero(date.getHours());
        var min     = addZero(date.getMinutes());
        var second  = addZero(date.getSeconds());
        var ms      = addZero(date.getMilliseconds());
        var datefmt = "";

        var ymd     = year2 + "-" + month + "-" + day;
        var fymd    = year  + "-" + month + "-" + day;
        var hms     = hour  + ":" + min   + ":" + second;

        switch (format)
        {
            case "UNIX Time" :
                datefmt = date.getTime();
                break;

            case "UTC" :
                datefmt = date.toUTCString();
                break;

            case "yy" :
                datefmt = year2;
                break;

            case "year" :
            case "yyyy" :
                datefmt = year;
                break;

            case "month" :
            case "mm" :
                datefmt = month;
                break;

            case "cn-week-day" :
            case "cn-wd" :
                var cnWeekDays = ["鏃�", "涓€", "浜�", "涓�", "鍥�", "浜�", "鍏�"];
                datefmt = "鏄熸湡" + cnWeekDays[weekDay];
                break;

            case "week-day" :
            case "wd" :
                var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                datefmt = weekDays[weekDay];
                break;

            case "day" :
            case "dd" :
                datefmt = day;
                break;

            case "hour" :
            case "hh" :
                datefmt = hour;
                break;

            case "min" :
            case "ii" :
                datefmt = min;
                break;

            case "second" :
            case "ss" :
                datefmt = second;
                break;

            case "ms" :
                datefmt = ms;
                break;

            case "yy-mm-dd" :
                datefmt = ymd;
                break;

            case "yyyy-mm-dd" :
                datefmt = fymd;
                break;

            case "yyyy-mm-dd h:i:s ms" :
            case "full + ms" :
                datefmt = fymd + " " + hms + " " + ms;
                break;

            case "full" :
            case "yyyy-mm-dd h:i:s" :
            default:
                datefmt = fymd + " " + hms;
                break;
        }

        return datefmt;
    };

    return editormd;

}));