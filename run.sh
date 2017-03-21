#!/bin/bash
# Bash script to remove cursor and run browser on touchscreen
unclutter -idle 0.01 -root &
chromium-browser --app=http://localhost:8080 --start-fullscreen
