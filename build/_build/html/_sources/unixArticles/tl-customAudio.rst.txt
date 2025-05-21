Custom Audio files in Thirdlane PBX
===================================

Thirdlane uses asterisk at its core, and asterisk is very inline with the unix philosophy of 'everything is a file'. With that in mind all recordings are files, including IVRs, audio in hunt lists, and voicemail greetings.
This means that we can duplicate audio files, for example making the unavailable and busy message the same for one extension, or for all extensions, just copy and rename the files appropriately. 

In this example we have a prerecorded voicemail, voicemail.mp3 we want to apply to an extension. Asterisk will not work with mp3 files, so we will need to convert it to a wav file. ::

    ffmpeg -i input.mp3 -ar 8000 -ac 1 -codec pcm_s16le output.wav

Once this conversion is complete we can upload it to the server, in this case I want it on extension 1001 for the demo tenant. ::

    cd /var/spool/asterisk/voicemail/default-demo/1001/
    scp user@192.168.1.2:~/output.wav unavail.wav
    user@192.168.1.2's password: 
    unavail.wav                                                                                                                                               100%  150KB 795.2KB/s   00:00  
    cp unavail.wav busy.wav 
    cp: overwrite Y

Thats it, your done!
