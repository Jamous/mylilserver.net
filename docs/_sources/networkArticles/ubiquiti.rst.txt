Ubiquiti Edgerouter notes
=========================

Show MAC address table
----------------------
| #### Show MAC address table for switched interfaces: 
| ``sudo /sbin/switch dump``
| https://www.reddit.com/r/Ubiquiti/comments/13rmowg/erx_switch_show_mac_table/

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


Usefull commands
----------------
| #### Start tcpdump and save to file
| ``sudo tcpdump -i eth0 -w output.pcap``

