Mirkotik notes
===========================================

Interacting with the system
----------------------------

| RouterOS is like a Unix filesystem.
| Grey items are folders, pink items are programs.

| ####View config
| View interfaces ``interface print``
| view values ``print``
| view config (show run) ``/export``

| ##### show mac address table
| #This one is horrible. We have to show mac table for the bridge then 'where' for our interface? I guess its not that bad, I am just frustrated that good old regex won’t work.
| #Find MAC addresses on interface1 on the bridge
| ``interface/bridge/host/print where on-interface=ether1``
| https://agink.id/2020/05/mikrotik-tutorial-show-mac-address-table/

| #### Help
| F1 shows help for all commands on screen.

| #### "Safe mode" (commit confirm)
| F4 enables "Safe mode" which is equivalent to a commit confirm. If you enter safe mode and make changes but get disconnected all changes will revert.

| #### Interactive edit
| #There is an interactive edit mode, its edit

| #### Grep
| #The miktotik falls short with the grep command. There is something called 'message' but it sucks. You must search by column name.
| #I have not found the reverse of this.
| ``print where message~"[regex here]"``
| https://www.reddit.com/r/mikrotik/comments/125ur9v/filter_export_for_expression_using_where/

| #### LLDP Neighbor discovery
| ``/ip neighbor/print``
| https://help.mikrotik.com/docs/display/ROS/Neighbor+discovery#Neighbordiscovery-LLDP

Interface commands
------------------
| #### Documentation
| https://help.mikrotik.com/docs/display/ROS/Interface+stats+and+monitor-traffic

| #### view interfaces
| #View all interfaces
| ``/interface/print``

| #View only admin down interfaces
| ``/interface/print where disabled``

| #View only up interfaces
| ``/interface/print where running``


| #### Show interface status
| #Up/down is set with a flag here
| ``/interface/print stats``

| #Show interface status verbose
| ``/interface/print stats-detail``


| #### Setting interface admin status
| #Set interface to admin down
| ``/interface/ethernet/disable [interface name]``

| #Set interface to admin up
| ``/interface/ethernet/enable [interface name]``


| #### Show link status (speed/duplex)
| ``/interface/ethernet/monitor [interface name]``


| #### Show interface status for individual interface
| ``/interface/print stats-detail where name=[port name]``


| #### Show SFP module and information
| ``/interface/ethernet/monitor [sfp port name]``

Configuration
-------------
| #### Changing hostname
| ``/system identity set name=[new name]``


| #### Networking
| Set DHCP management address ``/ip dhcp-client add interface=bridge``
| Set static IP address: ``/ip address add address=192.168.88.1/24 interface=bridge network=192.168.88.0``
| https://wiki.mikrotik.com/wiki/Manual:IP/DNS
| https://wiki.mikrotik.com/wiki/Manual:IP/DHCP_Client


| #### DHCP snooping
| #Set an existing interface on the bridge to be trusted
| ``/interface bridge port set interface=ether1 trusted=yes``
| ``numbers: *``

| #Enable DHCP snooping
| ``/interface bridge set [find where name="bridge"] dhcp-snooping=yes``

| #Verify this with export
| ``/interface bridge export``
| https://help.mikrotik.com/docs/display/ROS/Bridging+and+Switching#BridgingandSwitching-DHCPSnoopingandDHCPOption82

| #### Reboot the switch
| ``/system reboot``

| #### Updates
| Updates take about 5 minuites

| #### L2 hardware offloading
| #L2 hardware offloading is enabled by default. This can be viewed with
| ``/interface/bridge/port print``
| It looks like there are some limitations to this, onely one bridge can be hardware offloaded. This does not apply to CRS 3XX switches.
| https://wiki.mikrotik.com/wiki/Manual:Layer2_misconfiguration#Bridges_on_a_single_switch_chip


| #### Spanningtree
| https://wiki.mikrotik.com/wiki/Manual:Spanning_Tree_Protocol

| #View spanningtree - We will be running RSTP, so all bridges will have the same setup.
| ``/interface/bridge/monitor bridge``
| ``/interface/bridge/port/print``

| #Set portfast - Enabled by default untill a BPDU is found.
| ``/interface/bridge/port set edge=yes``

| #Enable bpdu-guard
| ``/interface/bridge/port set bpdu-guard=yes``

| #Define interface priority
| ``/interface/bridge/edit bridge priority``

Vlans
-----
| https://help.mikrotik.com/docs/display/ROS/Basic+VLAN+switching
| https://help.mikrotik.com/docs/display/ROS/Bridging+and+Switching#BridgingandSwitching-BridgeVLANFiltering
| #CRS 3XX switches do this all in hardware by default

| #vlan-filtering must be enabled on the bridge (set to default)
| ``/interface/bridge/set vlan-filtering=yes``

| #Set copper ports to access ports
| ``/interface/bridge/port set frame-types=admit-only-untagged-and-priority-tagged [find where interface~"ether"]``

| #Set SFP ports to trunk ports
| ``/interface/bridge/port set frame-types=admit-only-vlan-tagged [find where interface~"sfp-sfpplus"]``

| #Set our port per-vlan-id, the vlan untagged traffic will be on (we have to kind of do this part twice...)
| ``/interface/bridge/port set pvid=(insert pvid)``

Manipulateing multiple interfaces at once
-----------------------------------------
| #Set command on all ethernet interfaces
| ``/interface/bridge/port set [find where interface~"ether"]``

| #Set command on all SFP interfaces
| ``/interface/bridge/port set [find where interface~"sfp-sfpplus"]``
