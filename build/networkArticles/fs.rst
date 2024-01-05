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



Resources
---------
	* S3400 refrence guide: `https://resource.fs.com/mall/doc/20230602224707z9fqeu.pdf <https://resource.fs.com/mall/doc/20230602224707z9fqeu.pdf>`_
	* S2805s refrence guide: `https://resource.fs.com/mall/doc/20240103181927up3qye.pdf <https://resource.fs.com/mall/doc/20240103181927up3qye.pdf>`_
