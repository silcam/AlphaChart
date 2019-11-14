#!/bin/bash

scp deploy-remote.sh alphachart@iozoom:/var/www/alphachart/

ssh alphachart@iozoom /var/www/alphachart/deploy-remote.sh




