package common

import (
	"md_note/pkg"
	"reflect"
	"regexp"
	"strings"
)

func Empty(val interface{}) bool {
	if val == nil {
		return true
	}
	v := reflect.ValueOf(val)
	switch v.Kind() {
	case reflect.String, reflect.Array:
		return v.Len() == 0
	case reflect.Map, reflect.Slice:
		return v.Len() == 0 || v.IsNil()
	case reflect.Bool:
		return !v.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return v.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return v.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return v.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return v.IsNil()
	}
	return reflect.DeepEqual(val, reflect.Zero(v.Type()).Interface())
}

func IsInStringSlice(need string, rows []string) bool {
	for _, row := range rows {
		if need == row {
			return true
		}
	}

	return false
}

func BeautifulString(str string) string {
	reg := regexp.MustCompile(`\d+@`)
	str = reg.ReplaceAllString(str, "")
	str = strings.Replace(str, ".md", "", -1)
	return strings.Replace(str, pkg.Viper.GetString("MD.PATH"), "", -1)
}
