#! /usr/bin/env python
"""
devnames.py
List of names and labels of LIFX lights

Created by Jeremy Smith on 2017-01-20
j.smith.03@cantab.net
"""


device_names = {
    'switchalllights': "all",
    'switchfloorlamp': "Floor light",
    'switchsmalllight': "Small lamp",
    'switchbedroomlight': "Bedroom lamp"
}

label_names = {v: k for k, v in device_names.iteritems()}
