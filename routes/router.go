package routes

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	mathjax "github.com/litao91/goldmark-mathjax"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark-emoji"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"go.abhg.dev/goldmark/mermaid"
	"go.abhg.dev/goldmark/toc"
	"html/template"
	"log"
	"md_note/common"
	"md_note/pkg"
	"net/http"
	"os"
	"strings"
	"time"
)

const TEMPLATE_404 = "404.html"
const TEMPLATE_500 = "500.html"
const TEMPLATE_INDEX = "index.html"

var routerMap map[string]string
var navs []common.NavItem

func init() {
	routerMap = make(map[string]string)
	navs = make([]common.NavItem, 0)
}

func AutoRegisterRoute(router *gin.Engine) {
	go func() {
		defer func() {
			if err := recover(); err != nil {
				fmt.Println("recover AutoRegisterRoute \n", err)
			}
		}()

		ignore := pkg.Viper.GetStringSlice("md.ignore")
		mdPath := pkg.Viper.GetString("md.path")
		routes := map[string]string{"/": "/"}

		for {
			// 加载路由及导航
			navs = loadRoutesAndNavigations(mdPath, ignore, routes)

			// 注册路由
			registerRouter(router, routes)

			time.Sleep(time.Duration(pkg.Viper.GetInt("app.cache")) * time.Minute)
		}
	}()
}

func loadRoutesAndNavigations(path string, ignore []string, routes map[string]string) []common.NavItem {
	loadNavs := make([]common.NavItem, 0)

	fs, _ := os.ReadDir(path)
	for _, f := range fs {
		if common.IsInStringSlice(f.Name(), ignore) {
			continue
		}

		nav := common.NavItem{
			Name: common.BeautifulString(f.Name()),
			Path: common.BeautifulString(fmt.Sprintf("%s/%s", path, f.Name())),
		}

		name := strings.Replace(f.Name(), ".md", "", -1)
		if f.IsDir() {
			nav.Path = common.BeautifulString(fmt.Sprintf("%s/%s", nav.Path, name))
			nav.Child = loadRoutesAndNavigations(fmt.Sprintf("%s/%s", path, f.Name()), ignore, routes)
		} else {
			nav.IsFile = true
			router := fmt.Sprintf("%s/%s", path, f.Name())
			routes[common.BeautifulString(router)] = router
		}

		loadNavs = append(loadNavs, nav)
	}

	return loadNavs
}

func registerRouter(router *gin.Engine, routes map[string]string) {
	for _, r := range routes {
		nr := common.BeautifulString(r)
		if _, ok := routerMap[nr]; !ok {
			routerMap[nr] = r
			router.GET(nr, websiteHandler)
		}
	}
}

func websiteHandler(ctx *gin.Context) {
	path := ctx.FullPath()

	// 未找到路由
	filePath, ok := routerMap[path]
	if !ok {
		ctx.HTML(http.StatusOK, TEMPLATE_404, gin.H{
			"title": pkg.Viper.GetString("app.name"),
		})
		return
	}

	content := loadHomeContent()
	if path != "/" {
		article, err := loadArticleContent(filePath)
		if err != nil {
			log.Fatal("load article fail :" + err.Error())

			ctx.HTML(http.StatusOK, TEMPLATE_404, gin.H{
				"title": pkg.Viper.GetString("app.name"),
			})
			return
		}

		content = article
	}

	ctx.HTML(http.StatusOK, TEMPLATE_INDEX, gin.H{
		"title":   pkg.Viper.GetString("app.name"),
		"website": pkg.Viper.GetStringMapString("website"),
		"content": template.HTML(content),
		"navs":    loadActiveRoutes(navs, strings.Split(path, "/")),
	})
}

func loadActiveRoutes(navItems []common.NavItem, clickPath []string) []common.NavItem {
	nvs := make([]common.NavItem, len(navItems))
	for i, item := range navItems {
		if common.IsInStringSlice(item.Name, clickPath) {
			item.Active = true

			if item.Child != nil {
				item.Child = loadActiveRoutes(item.Child, clickPath)
			}
		}

		nvs[i] = item
	}

	return nvs
}

func loadHomeContent() string {
	content := "<div style=\"width:100%;display:flex;justify-content:center;align-items: center;font-size:30px\">\n                    <div>欢迎来到 <span style=\"font-size: larger;font-weight: bolder\">" + pkg.Viper.GetString("app.name") + "</span> 的文档管理站</div>\n</div>"
	if welcome := pkg.Viper.GetString("app.home_content"); welcome != "" {
		content = welcome
	}
	return content
}

func loadArticleContent(fileName string) (content string, err error) {
	f, err := os.ReadFile(fileName)
	if err != nil {
		return
	}

	ext := []goldmark.Extender{
		mathjax.MathJax,
		extension.GFM,
		extension.Footnote,
		extension.DefinitionList,
		extension.Typographer,
		emoji.Emoji,
		extension.Footnote,
		&mermaid.Extender{
			RenderMode: mermaid.RenderModeServer, // or RenderModeClient
		},
	}

	if pkg.Viper.GetBool("md.toc") {
		ext = append(ext, &toc.Extender{
			Title:    "目录", // 目录标题
			MaxDepth: 5,    // 限制目录的深度
		})
	}

	md := goldmark.New(
		goldmark.WithExtensions(ext...),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
			parser.WithBlockParsers(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
			html.WithUnsafe(),
		),
	)
	var buf bytes.Buffer
	if err = md.Convert(f, &buf); err != nil {
		return
	}

	return buf.String(), nil
}
