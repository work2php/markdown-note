package common

type Cfg struct {
}

type NavItem struct {
	Name   string    `json:"name"`
	Path   string    `json:"path"`
	IsFile bool      `json:"is_file"`
	Active bool      `json:"active"`
	Child  []NavItem `json:"child"`
}
