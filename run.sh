#!/bin/bash
unclutter -idle 0.01 -root &
chromium-browser --app=http://localhost:8080 --start-fullscreen
