#! /usr/bin/env python
"""
messages.py
List of messages and codes for LIFX HTTP control

Created by Jeremy Smith on 2016-12-12
j.smith.03@cantab.net
"""


no_error_codes = {
    200: "OK: Everything worked as expected",
    207: "Multi-Status: Inspect the response body to check status on individual operations"}

error_codes = {
    400: "Bad Request: Request was invalid",
    401: "Unauthorized: Bad access token",
    403: "Permission Denied: Bad OAuth scope",
    404: "Not Found: Selector did not match any lights",
    422: "Unprocessable Entity: Missing or malformed parameters",
    426: "Upgrade Required: HTTP was used to make the request instead of HTTPS",
    429: "Too Many Requests: The request exceeded a rate limit",
    500: "Server Error: Something went wrong on LIFX's end",
    502: "Server Error: Something went wrong on LIFX's end",
    503: "Server Error: Something went wrong on LIFX's end",
    523: "Server Error: Something went wrong on LIFX's end"}

status = {
    'ok': "Light accepted the request and will begin processing",
    'timed_out': "Light is unlikely to have accepted the request, LIFX servers did not get an acknowledgment from the light",
    'offline': "Light did not accept the request because it is physically powered off or unreachable over the internet"}
