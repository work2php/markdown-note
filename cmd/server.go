package cmd

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"md_note/common"
	"md_note/pkg"
	"md_note/routes"
)

func WebStart() {
	cfgPath := "./config"
	// 加载配置文件
	pkg.LoadViperConfig(cfgPath)
	router := gin.Default()

	router.Static("./static", "./web/static")
	router.Static("./images", fmt.Sprintf("%s/images", pkg.Viper.GetString("MD_PATH")))
	router.StaticFile("./favicon.ico", "./favicon.icon")
	router.SetFuncMap(template.FuncMap{"notEmpty": NotEmpty})
	router.LoadHTMLGlob("./web/templates/*")

	// 注册路由
	routes.AutoRegisterRoute(router)

	err := router.Run(":" + pkg.Viper.GetString("APP.PORT"))
	if err != nil {
		panic("start server fail :" + err.Error())
	}
}

func NotEmpty(val interface{}) bool {
	return !common.Empty(val)
}
