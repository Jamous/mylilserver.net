Thirdlane PBX
=============
Notes on thirdlane PBX

SMS troubleshooting
-------------------
SMS are processed at api-server-ng service - it's dockerized - you can see it's logs with ``journalctl -u api-server-ng`` or ``docker logs api-server-ng``

Make api-server-ng logging more verbose, edit /etc/sysconfig/api-server-ng.local 
``TL_LOG_LEVEL=debug``
``systemctl restart api-server-ng.service``
