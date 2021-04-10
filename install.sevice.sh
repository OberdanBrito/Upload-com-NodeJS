#!/bin/bash

cp ./ws.service /etc/systemd/system/

systemctl enable ws
systemctl start ws