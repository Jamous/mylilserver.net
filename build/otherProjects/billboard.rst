Raspbery Pi Digital Billboard
===============================================

This is a general guide to setting up a raspberry pi digital billboard. I have not had the chance to fully test this script yet, however it is adapted from a previous build I have completed. I also fully intend to move this onto GitHub once it is stable (just to become more familiar with GitHub).

.. code-block:: bash

        #This bash file sets up raspberry Pi devices for the CRC
        #This file must be run via SUDO on the default login account
        #To run this file input the following four lines, subtract the #
	
        #mv setup.sh ~/setup.sh
	#cd ~/
	#chmod 770 setup.sh
	#sudo sh setup.sh

	# ~Pre work~
	#The devices should have the offical buster image installed.
	#They should also have an active network connection


	# Install software
	apt update -y
	apt upgrade -y
	apt install feh vim -y

	#Networking
	echo Network address in CIDR notation?
	echo Ex 192.168.1.2/24
	read networkAddress
	echo Router?
	echo Ex 192.168.1.1
	read routerAddress
	echo DNS server 1
	read dnsOne
	echo DNS server 2
	read dnsTwo

	#Remove old dhcpcd.conf
	mv /etc/dhcpcd.conf /etc/dhcpcd.conf.old

	#Create new network config
	echo "
	interface eth0
	static ip_address=$networkAddress
	static routers=$routerAddress
	static domain_name_servers=$dnsOne $dnsTwo
	" > /etc/dhcpcd.conf

	#Reassign permissions for dhcpcd.conf
	chmod 664 /etc/dhcpcd.conf

	#Enable SSH
	systemctl start ssh
	systemctl enable ssh

	#Enable VNC
	ln /usr/lib/systemd/system/vncserver-x11-serviced.service /etc/systemd/system/multi-user.target.wants/vncserver-x11-serviced.service
	systemctl start vncserver-x11-serviced

	#Check the network config
	echo Attempting to ping the router
	if ping -c 4 $routerAddress > /dev/null
	then
		echo Success
	else
		echo The router can not be reached. Please troubleshoot the network config/try again before contuning.
		exit
	fi
	echo Attempting to ping $dnsOne
	if ping -c 4 $dnsOne > /dev/null
	then
		echo Success
	else
		echo The DNS server can not be reached. Please troubleshoot the network config/try again before contuning.
		exit
	fi
	echo Attempting to ping google.com
	if ping -c 4 google.com > /dev/null
	then
		echo Success
	else
		echo DNS resolution has failed. Please troubleshoot the network config/try again before contuning.
		exit
	fi

	#????? How do i add in checks here?

	#Create new drive to mount
	mkdir /home/$USER/networkDrive

	#Add network drive to fstab
	echo What folder network folder should feh look for the .jpg images in?
	echo Ex: //192.168.1.3/TV/
	read networkLocation

        #add login credentials for fstab, if needed


        echo server login username (leave blank if not needed)
        read serverUsername
        echo server login password (leave blank if not needed)
        read serverPassword
	echo "
	$networkLocation cifs username=$serverUsername,password=$serverPassword,noserverino
	" >> /etc/fstab

	#Crate start.sh
	#Start.sh checks the netowrk drive, starts and restarts feh
	echo "
	service=feh

	#/dev/null is a self clearing file. Nothing can be written to it.
	#This logic test checks if the output of pgrep can be written to /dev/null
	#If there is no output, it can not be written, and fails.
	if pgrep "$service" >/dev/null
	then
		echo "$service is running"
	else
			echo "$service is not running... Starting"
			sleep 1m
			sudo mount -a
			feh -Y -x -q -D 30 -B black -F -Z -r -R 500 /home/$USER/networkDrive/
	fi" > /home/$USER/start.sh
	chmod 755 /home/$USER/start.sh

	#Set to start at bootup
	#Configure Display to never turn off
	echo "
	@xset s off
	@xset -dpms
	@xset s noblank
	sh /home/$USER/start.sh
	" >> /etc/xdg/lxsession/LXDE-pi/autostart

	#Create restart cron job
	echo "
	* * * * * sh /home/pi/start.sh
	" > /var/spool/cron/$USER

	#Troubleshooting/README
	echo "
	At this point the instulation should be done.
	For troubleshooting read below, or read README with
	more ~/README

	If FEH does not start automaticly after a reboot there was an errer (Please allow up to five minuites after a reboot for feh to launch) . Use the following command to view this files contents, and track down the error.

#To view the setup and start scripts::
more /home/$USER/setup.sh
more /home/$USER/start.sh

#To check if feh is running
pgrep feh

#To check if the crontab is setup (It may be in either of these commands. The Crontab should show up.)
crontab -l
sudo crontab -u root -l


feh:
feh is the slideshow program, it runs in the CLI
-Y: hide pointer
-x: Borderless
-q: quiet no error reporting
-D: Slide delay in seconds
-B: image background
-F: fullscreen
-R: reload filelist every x seconds
feh -Y -x -q -D 30 -B black -F -Z -r -R 500 /home/pi/networkDrive/
" > /home/$USER/README

