#! /usr/bin/env python
"""
pylifx.py
Library for LIFX HTTP API Control

Created by Jeremy Smith on 2016-12-12
j.smith.03@cantab.net
"""

import os
import sys
import requests
import json
import messages

__author__ = "Jeremy Smith"
__version__ = "1.0"


def parseJSONresponse(response, disp=True):
	"""Parses the JSON response"""
	data = json.loads(response.text)
	status = response.status_code
	headers = dict(response.headers)
	nlights = len(data)

	if status in messages.no_error_codes:
		if disp:
			print "{:d}: {:s}".format(status, messages.no_error_codes[status])
	elif status in messages.error_codes:
		error = "{:d}: {:s}".format(status, messages.error_codes[status])
		raise Exception(error)
	else:
		raise Exception("Unknown Error Code")

	if disp:
		print json.dumps(data, indent=4, sort_keys=True)

	return {'status': status, 'data': data, 'headers': headers, 'nlights': nlights}


class LifxObject():
	"""General LIFX class"""
	def __init__(self, apitoken=None):
		self.apitoken = apitoken
		self.headers = {"Authorization": "Bearer {:s}".format(apitoken)}
		self.base_url = "https://api.lifx.com/v1/"
		self.lights = None
		self.scenes = None

	def list_lights(self, selector='all'):
		response = requests.get('{:s}lights/{:s}'.format(self.base_url, selector), headers=self.headers)
		parsed_response = parseJSONresponse(response)
		self.lights = parsed_response
		return parsed_response

	def set_states(self, states):
		data = json.dumps(states)
		response = requests.put('{:s}lights/states'.format(self.base_url), data=data, headers=self.headers)
		parsed_response = parseJSONresponse(response)
		return response

	def toggle_power(self, selector='all', duration='1'):
		data = {"duration": duration}
		response = requests.post('{:s}lights/{:s}/toggle'.format(self.base_url, selector), data=data, headers=self.headers)
		parsed_response = parseJSONresponse(response)
		return response

	def list_scenes(self):
		response = requests.get('{:s}scenes'.format(self.base_url), headers=headers)
		parsed_response = parseJSONresponse(response)
		self.scenes = parsed_response
		return response

	def activate_scene(self, scene_id, duration='1'):
		data = {"duration": duration}
		response = requests.put('{:s}scenes/scene_id:{:s}/activate'.format(self.base_url, scene_id), data=data, headers=self.headers)
		parsed_response = parseJSONresponse(response)
		return response
