package pkg

import (
	"fmt"
	"time"
)

func IsLocal() bool {
	return Viper.GetString("app.env") == "local"
}

func IsProduction() bool {
	return Viper.GetString("app.env") == "production"
}

func MicrosecondsStr(elapsed time.Duration) string {
	return fmt.Sprintf("%.3fms", float64(elapsed.Nanoseconds())/1e6)
}
