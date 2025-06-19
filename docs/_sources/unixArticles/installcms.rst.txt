Install Calix Managment System (CMS) on debian 12
=================================================

Some CMS client applications are old 32 bit java codes, they are downloaded from the cms sserver as an installer.bin file. 
This is a self contained installer including the jre needed for this application.
We can easily install this on debian 12 by installing some missing 32 bit gtk modules then installing the client. ::

	sudo apt update -y
	sudo apt install -y libgtk2.0-0:i386 libxtst6:i386 libxrender1:i386 libxi6:i386
	bash install.bin

This will install cms at ``~/Calix``

You can launch the application like this ::

	 ~/Calix/EMSGui
