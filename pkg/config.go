package pkg

import (
	viperLib "github.com/spf13/viper"
)

var Viper *viperLib.Viper

func init() {
	Viper = viperLib.New()

	Viper.SetConfigName("config")
	Viper.SetConfigType("yaml")
}

func LoadViperConfig(path string) {
	if path == "" {
		path = "./config"
	}
	Viper.AddConfigPath(path)

	err := Viper.ReadInConfig()
	if err != nil {
		panic("load config fail:" + err.Error())
	}
	Viper.WatchConfig()
}
