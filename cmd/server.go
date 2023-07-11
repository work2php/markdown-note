package cmd

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"md_note/common"
	"md_note/middlewares"
	"md_note/pkg"
	"md_note/routes"
)

func WebStart() {
	// 加载配置文件
	pkg.LoadViperConfig("")

	// 加载日志
	pkg.LoadZapLogger()

	model := gin.ReleaseMode
	if pkg.IsLocal() {
		model = gin.DebugMode
	}
	gin.SetMode(model)

	router := gin.New()
	router.Use(middlewares.LoggerMiddleware(), middlewares.Recovery())

	router.Static("/static", "./web/static")
	router.Static("/images", fmt.Sprintf("%s/images", pkg.Viper.GetString("md.path")))
	router.StaticFile("./favicon.ico", "./favicon.icon")
	router.SetFuncMap(template.FuncMap{"notEmpty": NotEmpty})
	router.LoadHTMLGlob("./web/templates/*")

	// 注册路由
	routes.AutoRegisterRoute(router)
	err := router.Run(":" + pkg.Viper.GetString("app.port"))
	if err != nil {
		panic("start server fail :" + err.Error())
	}

	// 更新markdown文档
	//pkg.GitMarkdownData()
}

func NotEmpty(val interface{}) bool {
	return !common.Empty(val)
}
