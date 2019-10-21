#!/bin/bash

scp deploy-remote.sh alphachart@george:/var/www/alphachart/

ssh alphachart@george /var/www/alphachart/deploy-remote.sh




