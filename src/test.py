#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# [FILE] test.py
#
# [DESCRIPTION]
#  Execute GET and POST methods of the sample REST server
#
# [NOTE]
#
import sys
import requests

args_count = len(sys.argv) - 1
if args_count < 1:
    print("How to run:")
    print("$ python src/test.py <Access Token>")
    sys.exit()

# Change the URL as your environment
rest_url = 'http://localhost:5000/rest'
print("[REST URL]", rest_url)

# Set the current token here
token = sys.argv[1]

# Header
headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
}

# Confirm if the server works
res_data = None
try:
    response = requests.get(rest_url + "/test", headers=headers)
    res_data = response.json()
except requests.exceptions.RequestException as err:
    print("[Server Connection Error]:", err)

if res_data != None:
    print("---- Results from /test -----")
    print(res_data)
else:
    sys.exit()

# Get available countries
response = requests.get(rest_url+"/countries", headers=headers)
res_data = response.json()
print("---- Results from /countries -----")
print(res_data)

# Target country
#target_country = 'Japan'
#target_country = 'uk'
target_country = 'usa'
#target_country = 'china'
#target_country = 'unknown'

# Create a request
request = {}
request["country"] = target_country

# Get the country information
response = requests.post(rest_url+"/country_info", json=request, headers=headers)
res_data = response.json()
print("---- Results from /country_info -----")
print(res_data)

# Create a request
request = {}
request["country"] = target_country
request["num_of_days"] = 14 # two weeks

# Get the history data
response = requests.post(rest_url+"/history", json=request, headers=headers)
res_data = response.json()
print("---- Results from /history -----")
print(res_data)

#
# HISTORY
# [2] JUN-02-2024 - Added Authorization to the header
# [1] MAY-29-2024 - First release
#