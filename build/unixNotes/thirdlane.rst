Thirdlane PBX
=============
Notes on thirdlane PBX

Greetings and audio formats.
----------------------------

You can manually create and upload mailbox greetings per extension.
The file needs to be .wav, you can convert this using the cli tool ffmpeg. ::

	ffmpeg -i input.mp3 -acodec pcm_s16le -ac 1 -ar 8000 output.wav

Restarting pbxm-watcher service
-------------------------------
Sometimes the pbxm-watcher service will fail, and this will result in error logs and user status entries not showing up in the web ui. 
To fix this clear out the cached data and restart this service. ::

	rm -rf /var/lib/tarantool/pbxm-watcher/
	systemctl restart tarantool@pbxm-watcher

SMS troubleshooting
-------------------
SMS are processed at api-server-ng service - it's dockerized - you can see it's logs with ``journalctl -u api-server-ng`` or ``docker logs api-server-ng``

Make api-server-ng logging more verbose, edit /etc/sysconfig/api-server-ng.local 
``TL_LOG_LEVEL=debug``
``systemctl restart api-server-ng.service``
