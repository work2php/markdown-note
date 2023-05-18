package middlewares

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
	"go.uber.org/zap"
	"io"
	"md_note/pkg"
	"time"
)

type responseBodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (r responseBodyWriter) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

func LoggerMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 获取 response 内容
		w := &responseBodyWriter{body: &bytes.Buffer{}, ResponseWriter: ctx.Writer}
		ctx.Writer = w

		// 获取请求数据
		var requestBody []byte
		if ctx.Request.Body != nil {
			// ctx.Request.Body 是一个 buffer 对象，只能读取一次
			requestBody, _ = io.ReadAll(ctx.Request.Body)
			// 读取后，重新赋值 ctx.Request.Body ，以供后续的其他操作
			ctx.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
		}

		// 设置开始时间
		start := time.Now()
		ctx.Next()

		// 开始记录日志的逻辑
		cost := time.Since(start)
		responStatus := ctx.Writer.Status()

		logFields := []zap.Field{
			zap.Int("status", responStatus),
			zap.String("request", ctx.Request.Method+" "+ctx.Request.URL.String()),
			zap.String("query", ctx.Request.URL.RawQuery),
			zap.String("ip", ctx.ClientIP()),
			zap.String("user-agent", ctx.Request.UserAgent()),
			zap.String("errors", ctx.Errors.ByType(gin.ErrorTypePrivate).String()),
			zap.String("time", pkg.MicrosecondsStr(cost)),
		}
		if ctx.Request.Method == "POST" || ctx.Request.Method == "PUT" || ctx.Request.Method == "DELETE" {
			// 请求的内容
			logFields = append(logFields, zap.String("Request Body", string(requestBody)))

			// 响应的内容
			logFields = append(logFields, zap.String("Response Body", w.body.String()))
		}

		if responStatus > 400 && responStatus <= 499 {
			// 除了 StatusBadRequest 以外，warning 提示一下，常见的有 403 404，开发时都要注意
			pkg.Logger.Warn("HTTP Warning "+cast.ToString(responStatus), logFields...)
		} else if responStatus >= 500 && responStatus <= 599 {
			// 除了内部错误，记录 error
			pkg.Logger.Error("HTTP Error "+cast.ToString(responStatus), logFields...)
		} else {
			pkg.Logger.Debug("HTTP Access Log", logFields...)
		}
	}
}
