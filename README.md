    markdown-note是一款轻量的笔记程序，用于快速构建轻量笔记网站

#### 支持平台

> Windows、Linux 、Mac Os 

#### 安装

1. 拉取代码

> git clone https://github.com/work2php/markdown-note.git

2. 拉取依赖

> go mod download

3. 创建配置文件

>  cd config   
>  cp config.yml.example config.yml

4. 创建markdown文件目录

> cd markdown-blog-linux-amd64  
> mkdir md   
> echo "### Hello World" > ./md/主页.md

5. 按照示例修改配置文件

6. 启动程序

> go run main.go   

7. 访问http://localhost:9090,查看效果

