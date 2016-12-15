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


class LifxObject():
	def __init__(self, apitoken=None):
		self.apitoken = apitoken
		self.headers = {"Authorization": "Bearer {:s}".format(apitoken)}
		self.base_url = "https://api.lifx.com/v1/"
		self.lights = None
		self.scenes = None

	def list_lights(self, selector='all'):
		response = requests.get('{:s}lights/{:s}'.format(self.base_url, selector), headers=self.headers)
		print response


		self.lights = response
		return response

	def set_states(self, states):
		data = json.dumps(states)
		response = requests.put('{:s}lights/states'.format(self.base_url), data=data, headers=self.headers)
		return response

	def toggle_power(self, selector='all', duration='1'):
		data = {"duration": duration}
		response = requests.post('{:s}lights/{:s}/toggle'.format(self.base_url, selector), data=data, headers=headers)
		return response

	def list_scenes(self):
		response = requests.get('{:s}scenes'.format(self.base_url), headers=headers)
		self.scenes = response
		return response

	def activate_scene(self, scene_id, duration='1'):
		data = {"duration": duration}
		response = requests.put('{:s}scenes/scene_id:{:s}/activate'.format(self.base_url, scene_id), data=data, headers=headers)
		return response
