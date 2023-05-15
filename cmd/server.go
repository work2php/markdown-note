package cmd

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"md_note/pkg"
	"md_note/routes"
	"net/http"
)

func WebStart() {
	cfgPath := "./config"
	// 加载配置文件
	pkg.LoadViperConfig(cfgPath)
	router := gin.Default()

	router.Static("./static", "./web/static")
	router.Static("./images", fmt.Sprintf("%s/images", pkg.Viper.GetString("MD_PATH")))
	router.LoadHTMLGlob("./web/templates/*")

	// 注册路由
	routes.AutoRegisterRoute(router)

	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "index.html", gin.H{
			"title":   pkg.Viper.Get("APP.NAME"),
			"website": pkg.Viper.GetStringMapString("WEBSITE"),
		})
	})
	err := router.Run(":" + pkg.Viper.GetString("APP.PORT"))
	if err != nil {
		panic("start server fail :" + err.Error())
	}
}
