#! /usr/bin/env python
"""
lifxtest.py
Testing for LIFX HTTP control

Created by Jeremy Smith on 2016-12-12
j.smith.03@cantab.net
"""

import os
import sys
import yaml
import pylifx

__author__ = "Jeremy Smith"
__version__ = "1.0"


def main():
	with open('config.yml', 'r') as configfile:
		cfg = yaml.load(configfile)

	token = cfg['apisecret']['token']


	return


if __name__ == "__main__":
	sys.exit(main())
