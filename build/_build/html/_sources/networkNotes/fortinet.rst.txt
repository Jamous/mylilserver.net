Fortinet Notes
==============

Fortigate default address
-------------------------
By default the fortigate LAN interface is at ``192.168.1.99``

Fortigate system controll
-------------------------
You can interact with fortigate services as unix services using ``fnsysctl``. See examples below
	* View all processes (equivelent to ps -ax): ``fnsysctl ps``
	* Kill all processes (equivelent to pkill) ``fnsysctl killall <process_name>``
	* View interfacs (similar to ip a): ``fnsysctl ifconfig``
	* View interface error: ``fnsysctl ifconfig <nic-name>``
