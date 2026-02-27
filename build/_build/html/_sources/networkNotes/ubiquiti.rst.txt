Ubiquiti Edgerouter notes
=========================

Show MAC address table - ER-X/ER-X-SFP
--------------------------------------
| #### Show MAC address table for switched interfaces: 
| ``sudo /sbin/switch dump``
| https://www.reddit.com/r/Ubiquiti/comments/13rmowg/erx_switch_show_mac_table/

Show MAC address table - ER-12
------------------------------
``/sbin/bridge fdb show``


IPv6 router advertisements to clients (staticly assigned)
---------------------------------------------------------
#### Manually assign interface address, and set RA to advertise slaac configuration ::

    interfaces {
        ethernet eth0 {
            address 2001:db8::1/64
            address 192.168.10.1/24
            duplex auto
            ipv6 {
                router-advert {
                    prefix 2001:db8::/64 {
                        autonomous-flag true
                    }
                }
            }
            speed auto
        }
    }

IPv6 firewall rules
-------------------

| Firewall rules are the same for v4 and v6, however v6 rules do not show up in the web interface. Also, the web interface will not load via v6.
| In this example we will limit access to the local device from the wan to one trusted network

.. code-block:: bash

    firewall {
        group {
            ipv6-network-group mgmnt_networks_6 {
                ipv6-network 2002:db8::/48
            }
        ipv6-name WAN_LOCAL_6 {
            default-action drop
            rule 10 {
                action accept
                description "Allow established/related"
                log disable
                protocol all
                state {
                    established enable
                    invalid disable
                    new disable
                    related enable
                }
            }
            rule 20 {
                action accept
                description allow_icmp
                log disable
                protocol icmp
                state {
                    established enable
                    invalid disable
                    new enable
                    related enable
                }
            }
            rule 30 {
                action accept
                description allow_trusted
                log disable
                protocol all
                source {
                    group {
                        ipv6-network-group mgmnt_networks_6
                    }
                }
                state {
                    established enable
                    invalid disable
                    new enable
                    related enable
                }
            }
        }
      }
    }
    interfaces {
        ethernet eth0 {
            address 2001:db8::1/64
            address 192.168.10.1/24
            duplex auto
            firewall {
                local {
                    ipv6-name WAN_LOCAL_6
                    name WAN_LOCAL
                }
            }
            ipv6 {
                router-advert {
                    prefix 2001:db8::/64 {
                        autonomous-flag true
                    }
                }
            }
            speed auto
        }
    }


IPv6-PD client
--------------
| #### Aquiring IPv6 addressing using prefix delegation
| #Setup interface
| ``set interfaces ethernet eth0 ipv6 address autoconf``
| ``set interfaces ethernet eth0 ipv6 dup-addr-detect-transmits 1``


| #Enable prefix delegation to switch0
| ``set interfaces ethernet eth0 dhcpv6-pd pd 0 interface switch0 host-address '::1'``
| ``set interfaces ethernet eth0 dhcpv6-pd pd 0 interface switch0 service dhcpv6-stateless``
| ``set interfaces ethernet eth0 dhcpv6-pd pd 0 prefix-length /64``
| ``set interfaces ethernet eth0 dhcpv6-pd rapid-commit enable``

Complete config example ::

    interfaces {
        ethernet eth0 {
            address dhcp
            dhcpv6-pd {
                pd 1 {
                    interface switch0 {
                        host-address ::1
                        service dhcpv6-stateless
                    }
                    prefix-length /64
                }
                rapid-commit enable
            }
            duplex auto
            ipv6 {
                address {
                    autoconf
                }
                dup-addr-detect-transmits 1
            }
            speed auto
        }
        ethernet eth1 {
            duplex auto
            speed auto
        }
        ethernet eth2 {
            duplex auto
            speed auto
        }
        ethernet eth3 {
            duplex auto
            speed auto
        }
        ethernet eth4 {
            duplex auto
            poe {
                output off
            }
            speed auto
        }
        loopback lo {
        }
        switch switch0 {
            address 192.168.50.1/23
            mtu 1500
            switch-port {
                interface eth1 {
                }
                interface eth2 {
                }
                interface eth3 {
                }
                interface eth4 {
                }
                vlan-aware disable
            }
        }
    }


IPv6-PD server
--------------

SSH key authentication
----------------------
| You can set Edgerouters to allow ssh key based autnetication using the configs below.
| Key ``ecdsa-sha2-nistp256 MIIJKAIBAAKCAgEAl0Dm user@computer``

Set commands ::

    set system login user ubnt authentication public-keys user@computer key MIIJKAIBAAKCAgEAl0Dm
    set system login user ubnt authentication public-keys user@computer type ecdsa-sha2-nistp256

Restarting dhcp
---------------
You can restart the dhcp and dhcpv6 services with these commands ::

    /etc/init.d/dhcpdv6 restart
    /etc/init.d/dhcpd restart

Usefull commands
----------------
| #### Start tcpdump and save to file
| ``sudo tcpdump -i eth0 -w output.pcap``

| #### tftp tcpdump back off device
| ``tftp -p -l output.pcap -r output.pcap [IPv4 address]``
