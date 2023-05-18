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
	"strings"
	"time"
)

const TEMPLATE_404 = "404.html"
const TEMPLATE_500 = "500.html"
const TEMPLATE_INDEX = "index.html"

var routerMap map[string]string

func init() {
	routerMap = make(map[string]string)
}

func AutoRegisterRoute(router *gin.Engine) {
	go func() {
		defer func() {
			if err := recover(); err != nil {
				fmt.Println("recover AutoRegisterRoute \n", err)
			}
		}()

		for {
			registerRouter(router)
			time.Sleep(time.Duration(pkg.Viper.GetInt("app.cache")) * time.Minute)
		}
	}()
}

func registerRouter(router *gin.Engine) {
	mdPath := pkg.Viper.GetString("md.path")
	if mdPath == "" {
		mdPath = "./md"
	}

	routes := []string{"/"}
	routes = append(routes, loadRoutes(mdPath)...)
	if len(routes) == 0 {
		log.Fatal("load Routes empty ")
		return
	}

	for _, r := range routes {
		nr := common.BeautifulString(r)
		if _, ok := routerMap[nr]; !ok {
			routerMap[nr] = r
			router.GET(nr, WebsiteHandler)
		}
	}
}

func WebsiteHandler(ctx *gin.Context) {
	qPath := ctx.FullPath()

	// 未找到路由
	path, ok := routerMap[qPath]
	if !ok {
		ctx.HTML(http.StatusOK, TEMPLATE_404, gin.H{
			"title": pkg.Viper.GetString("app.name"),
		})
		return
	}

	content := loadHomeContent()
	if path != "/" {
		article, err := loadArticleContent(path)
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
		"navs":    LoadNavigations(strings.Split(path, "/")),
	})
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

func LoadNavigations(clickPath []string) []common.NavItem {
	return loadNavs(pkg.Viper.GetString("md.path"), clickPath)
}

func loadNavs(path string, clickPath []string) []common.NavItem {
	fs, err := os.ReadDir(path)
	if err != nil {
		log.Fatal("Read file fail:" + err.Error())
		return nil
	}

	navs := make([]common.NavItem, 0)
	ignore := pkg.Viper.GetStringSlice("md.ignore")
	for _, f := range fs {
		if common.IsInStringSlice(f.Name(), ignore) {
			continue
		}

		nav := common.NavItem{
			Name: common.BeautifulString(f.Name()),
			Path: common.BeautifulString(fmt.Sprintf("%s/%s", path, f.Name())),
		}

		name := strings.Replace(f.Name(), ".md", "", -1)
		if common.IsInStringSlice(f.Name(), clickPath) {
			nav.Active = true
		}
		if f.IsDir() {
			nav.Path = common.BeautifulString(fmt.Sprintf("%s/%s", nav.Path, name))
			nav.Child = loadNavs(fmt.Sprintf("%s/%s", path, f.Name()), clickPath)
		} else {
			nav.IsFile = true
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
	ignore := pkg.Viper.GetStringSlice("md.ignore")
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
