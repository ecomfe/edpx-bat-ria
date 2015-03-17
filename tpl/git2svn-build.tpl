#!/bin/sh
edp build --config=./edp-build-config-git2svn.js
cp ./git2svn_output/src/common/css/main.css ./src/common/css
rm -rf ./git2svn_output
