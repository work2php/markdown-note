package pkg

import (
	"fmt"
	"os"
	"os/exec"
	"time"
)

func GitMarkdownData() {
	go func() {
		for {
			projectPath, _ := os.Getwd()
			if err := os.Chdir(Viper.GetString("md.path")); err != nil {
				cmd := exec.Command("git", "clone", Viper.GetString("md.repo"), Viper.GetString("md.path"))
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				if err := cmd.Run(); err != nil {
					fmt.Println("Error cloning repository:", err)
					return
				}
				fmt.Println("Repository cloned successfully.")
			}

			// 更新代码
			fmt.Println("Pulling latest changes...")
			cmd := exec.Command("git", "pull")
			path, _ := os.Getwd()
			cmd.Dir = path
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				fmt.Println("Error pulling latest changes:", err)
				return
			}
			os.Chdir(projectPath)
			fmt.Println("Code updated successfully.")

			time.Sleep(30 * time.Duration(Viper.GetInt("app.cache")) * time.Minute)
		}
	}()
}
