Thirdlane PBX
=============
Notes on thirdlane PBX

Greetings and audio formats.
----------------------------

You can manually create and upload mailbox greetings per extension.
The file needs to be .wav, you can convert this using the cli tool ffmpeg. ::

	ffmpeg -i input.mp3 -acodec pcm_s16le -ac 1 -ar 8000 output.wav

SMS troubleshooting
-------------------
SMS are processed at api-server-ng service - it's dockerized - you can see it's logs with ``journalctl -u api-server-ng`` or ``docker logs api-server-ng``

Make api-server-ng logging more verbose, edit /etc/sysconfig/api-server-ng.local 
``TL_LOG_LEVEL=debug``
``systemctl restart api-server-ng.service``
