FS switch notes
===============

FS switches are divided out by series and chipsets. Devices from different series will have different Network Operating systems. 
Devices from within the same series may have different capabilities: PoE, staking, SFP vs SFP+, different CAM table sizes. 
These are good switches, I would highly recommend any of their products just read their documentation before purchasing.

FS S3400 series switches
------------------------
#### Backup config via TFTP ::

	switch-1#copy startup-config tftp [IPv4 address]
	Destination file name[startup-config]?[name of file]
	###
	TFTP:successfully send 17 blocks, 8431 bytes 

#### Load config from file ::
	
	Switch-1#copy tftp running-config
	TFTP server IP address: [IPv4 address]
	Source configuration file name: [name of file]
	Success.


FS S2805S series switches
-------------------------
#### Backup config via TFTP ::

	switch-1#upload configuration tftp inet [IPv4 address] [name of file]
	Uploading config file via TFTP...
	Upload config file via TFTP successfully.

#### Upload config via TFTP ::

    switch-1#load configuration tftp inet [IPv4 address] [name of file]
    Startup config will be updated, are you sure(y/n)? [n]y

    Downloading config file via TFTP...
    Download config file via TFTP successfully, need to reboot to take effect.
    switch-1#reboot
    If you do not save the settings, all changes made will be lost.
    Are you sure you want to proceed with the system reboot(y/n)?[n]y

| #### Enabble SSH
| SSH will not work untill a key has been generated. Generate keys as outline below.

::
		
	crypto key generate rsa
	crypto key refresh

SNMP
^^^^
| ## Hostname
| ``gbnPlatformOAM:hostName-[1.3.6.1.4.1.52642.1.2.1.1.2.10.0]``

| ## Interface name
| ``rfc1213:ifDescr-[1.3.6.1.2.1.2.2.1.2.1]``

| ## Interface description
| ``rfc2233:ifAlias-[1.3.6.1.2.1.31.1.1.1.18.1]``

| ## Interace admin status
| ``rfc1213:ifAdminStatus-[1.3.6.1.2.1.2.2.1.7.1]``

| ##Iface input PPS
| ``rfc1213:ifInUcastPkts-[1.3.6.1.2.1.2.2.1.11.1]``

| ##Iface output PPS
| ``rfc1213:ifOutUcastPkts-[1.3.6.1.2.1.2.2.1.17.1]``

| ## Mac address table (walk this)
| ``1.3.6.1.4.1.52642.1.2.4.1.2.1.1.1``


Resources
---------
	* S3400 refrence guide: `https://resource.fs.com/mall/doc/20230602224707z9fqeu.pdf <https://resource.fs.com/mall/doc/20230602224707z9fqeu.pdf>`_
	* S2805s refrence guide: `https://resource.fs.com/mall/doc/20240103181927up3qye.pdf <https://resource.fs.com/mall/doc/20240103181927up3qye.pdf>`_
