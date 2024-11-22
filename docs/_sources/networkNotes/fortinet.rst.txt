Fortinet Notes
==============

Fortigate default address
-------------------------
By default the fortigate LAN interface is at ``192.168.1.99``

Fortigate flow debugging
------------------------
You can view traffic flows through the fortigate. This will show firewall polices, routing, and nat actions on packet. See example below
        * Reset the flow filter ``diag debug flow filter clear``
        * Filter for protocol 1 (icmp) ``diagnose debug flow filter proto 1``
        * Set host to filter for (source or destination) ``diagnose debug flow filter addr 172.0.0.2``
        * Enable timestamps ``diagnose debug console timestamp enable``
        * Set number of flows to catch. ``diagnose debug flow trace start 1000``
        * Enable the filter ``diagnose debug enable``
        * Show the filter ``diag debug flow filter``

An example I have used. I like to leave off the timestamps, they create too many logs. ::

    diag debug flow filter clear
    diagnose debug flow filter addr 172.0.0.2
    diagnose debug flow trace start 1000
    diagnose debug enable


Fortigate system controll
-------------------------
You can interact with fortigate services as unix services using ``fnsysctl``. See examples below
	* View all processes (equivelent to ps -ax): ``fnsysctl ps``
	* Kill all processes (equivelent to pkill) ``fnsysctl killall <process_name>``
	* View interfacs (similar to ip a): ``fnsysctl ifconfig``
	* View interface error: ``fnsysctl ifconfig <nic-name>``
