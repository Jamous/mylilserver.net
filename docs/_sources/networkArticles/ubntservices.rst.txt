Manaing EdgeOS services
=======================

I see a lot of articles suggesting rebooting the Ubiquiti EdgeRouters frequently, however in some service provider applications this is not an option. Thankfully, since EdgeOS is built on Debian, we can restart individual services when there is an issue instead of rebooting the entire router. This also means you can edit system configurations similar to Debian, though this is not recommended for stability.

Starting in later firmware versions, EdgeOS began integrating Systemd. We can restart some services by restarting, or stopping and starting the systemd unit. Below is an example of how to find the name of a service and restart it. ::

    ubnt@ubnt:~$ systemctl | grep dhcp
    vyatta-dhcpd.service                                                                                                                         loaded active running   EdgeOS DHCP Server                                                                                                           
    vyatta-dhcpdv6.service                                                                                                                       loaded active running   EdgeOS DHCPv6 Server 
    ubnt@ubnt:~$ sudo systemctl stop vyatta-dhcpd.service
    ubnt@ubnt:~$ sudo systemctl start vyatta-dhcpd.service

There are wrappers for controlling systemd services in /etc/init.d to support legacy code. These wrappers are sometimes easier to restart and provide additional context and control over the services. In the case of dhcpd it is easier to use these wrappers. For example, the wrapper for dhcpd states "note I am disabling restart because no sig will cause dnsmasq to re-read it's config file. This is not good since I think it loses it's cache file on complete restart." ::

	ubnt@ubnt:~$ /etc/init.d/dhcpd restart

This example works with more then just dhcp. I will include examples of more services this will work with below.


Restarting dhcp
---------------
 ::

	ubnt@ubnt:~$ /etc/init.d/dhcpd restart

Restarting dhcpv6
-----------------
 ::

	ubnt@ubnt:~$ /etc/init.d/dhcpdv6 restart
