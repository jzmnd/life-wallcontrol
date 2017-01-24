#! /usr/bin/env python
"""
lifxtest.py
Functions for LIFX HTTP control that are called by the dashingserver.js

Created by Jeremy Smith on 2017-01-19
j.smith.03@cantab.net
"""

import sys
import yaml
import json
import pylifx
import devnames
import time

__author__ = "Jeremy Smith"
__version__ = "1.0"


def read_in():
	l = sys.stdin.readlines()
	return json.loads(l[0])


def main():
	# Loads API key and creates LIFX object
	with open('config.yml', 'r') as configfile:
		cfg = yaml.load(configfile)
	token = cfg['apisecret']['token']
	mylights = pylifx.LifxObject(token)

	# Reads from stdin (waits for data)
	dataIn = read_in()

	# Query state command (q)
	if dataIn['command'] == 'q':
		lights = mylights.list_lights()

	# Toggle state command (t)
	if dataIn['command'] == 't':
		selector = devnames.device_names[dataIn['device']]
		if selector != 'all':
			selector = "label:{:s}".format(selector)
		mylights.toggle_power(selector=selector)
		time.sleep(1)
		lights = mylights.list_lights()

	# Set state command (s)
	if dataIn['command'] == 's':
		selector = devnames.device_names[dataIn['device']]
		brightness = dataIn['brightness']
		if selector != 'all':
			selector = "label:{:s}".format(selector)
		mylights.set_state(selector=selector, brightness=brightness)
		time.sleep(1)
		lights = mylights.list_lights()

	if not lights:
		return

	# JSON formatted output data
	dataOut = []
	for l in lights['data']:
		dataOut.append({"device": devnames.label_names[l['label']], "state": l['power']})
	
	# Write to stdout
	sys.stdout.write(json.dumps(dataOut))
	sys.stdout.flush()

	return


if __name__ == "__main__":
	main()
