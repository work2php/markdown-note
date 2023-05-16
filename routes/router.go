package routes

import (
	"bytes"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"html/template"
	"log"
	"md_note/common"
	"md_note/pkg"
	"net/http"
	"os"
	"regexp"
	"strings"
)

const TEMPLATE_404 = "404.html"
const TEMPLATE_500 = "500.html"
const TEMPLATE_INDEX = "index.html"

var routerMap map[string]string

func AutoRegisterRoute(router *gin.Engine) {
	registerRouter(router)
}

func registerRouter(router *gin.Engine) {
	mdPath := pkg.Viper.GetString("MD.PATH")
	if mdPath == "" {
		mdPath = "./md"
	}

	routes := []string{"/"}
	routes = append(routes, loadRoutes(mdPath)...)
	if len(routes) == 0 {
		log.Fatal("load Routes empty ")
		return
	}

	reg := regexp.MustCompile(`\d+@`)
	routerMap = make(map[string]string)
	for _, r := range routes {
		nr := reg.ReplaceAllString(r, "")
		nr = strings.Replace(nr, ".md", "", -1)
		nr = strings.Replace(nr, pkg.Viper.GetString("MD.PATH"), "", -1)
		routerMap[nr] = r
		router.GET(nr, WebsiteHandler)
	}
}

func WebsiteHandler(ctx *gin.Context) {
	qPath := ctx.FullPath()

	// 未找到路由
	path, ok := routerMap[qPath]
	if !ok {
		ctx.HTML(http.StatusOK, TEMPLATE_404, gin.H{
			"title": pkg.Viper.GetString("APP.NAME"),
		})
		return
	}

	content := loadHomeContent()
	if path != "/" {
		filename := fmt.Sprintf("%s.md", path)
		article, err := loadArticleContent(filename)
		if err != nil {
			log.Fatal("load article fail :" + err.Error())

			ctx.HTML(http.StatusOK, TEMPLATE_404, gin.H{
				"title": pkg.Viper.GetString("APP.NAME"),
			})
			return
		}

		content = article
	}

	ctx.HTML(http.StatusOK, TEMPLATE_INDEX, gin.H{
		"title":   pkg.Viper.GetString("APP.NAME"),
		"website": pkg.Viper.GetStringMapString("WEBSITE"),
		"content": template.HTML(content),
		"navs":    LoadNavigations(path),
	})
}

func loadHomeContent() string {
	content := "<div class=\"home-content\">\n                    <div>欢迎来到 <span style=\"font-size: larger;font-weight: bolder\">" + pkg.Viper.GetString("APP.NAME") + "</span> 的文档管理站</div>\n</div>"
	if welcome := pkg.Viper.GetString("APP.HOME_CONTENT"); welcome != "" {
		content = welcome
	}
	return content
}

func loadArticleContent(fileName string) (content string, err error) {
	mdPath := pkg.Viper.GetString("MD.PATH")
	f, err := os.ReadFile(fmt.Sprintf("%s/%s.md", mdPath, fileName))
	if err != nil {
		return
	}

	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
		),
	)
	var buf bytes.Buffer
	if err = md.Convert(f, &buf); err != nil {
		return
	}

	return buf.String(), nil
}

func LoadNavigations(clickPath string) []common.NavItem {
	navs := loadNavs(pkg.Viper.GetString("MD.PATH"), clickPath)
	return navs
}

func loadNavs(path, clickPath string) []common.NavItem {
	fs, err := os.ReadDir(path)
	if err != nil {
		log.Fatal()
		return nil
	}

	navs := make([]common.NavItem, 0)
	ignore := pkg.Viper.GetStringSlice("MD.IGNORE")
	for _, f := range fs {
		if common.IsInStringSlice(f.Name(), ignore) {
			continue
		}

		nav := common.NavItem{
			Name: f.Name(),
			Path: fmt.Sprintf("%s/%s", path, f.Name()),
		}

		if f.IsDir() {
			nav.Path = fmt.Sprintf("%s/%s", nav.Path, clickPath)
			nav.Child = loadNavs(path, nav.Path)
		} else {
			nav.Name = f.Name()
			nav.IsFile = true
		}

		if clickPath == nav.Path {
			nav.Active = true
		}

		navs = append(navs, nav)
	}

	return navs
}

func loadRoutes(path string) []string {
	fs, err := os.ReadDir(path)
	if err != nil {
		log.Fatal("load router fail :" + err.Error())
		return nil
	}

	routes := make([]string, 0)
	ignore := pkg.Viper.GetStringSlice("MD.IGNORE")
	for _, f := range fs {
		if common.IsInStringSlice(f.Name(), ignore) {
			continue
		}
		if f.IsDir() {
			routes = append(routes, loadRoutes(fmt.Sprintf("%s/%s", path, f.Name()))...)
		} else {
			routes = append(routes, fmt.Sprintf("%s/%s", path, f.Name()))
		}
	}

	return routes
}
