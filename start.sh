#!/usr/bin/env bash

sudo go build -o ./md_note
sudo nohup ./md_note 2>&1 >> /var/log/nohup.log &

