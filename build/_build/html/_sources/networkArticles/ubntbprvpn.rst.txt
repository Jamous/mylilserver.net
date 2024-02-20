Ubiquiti Edgerouter VPN with Policy Based routing
=================================================

In this areticle we will be building a route based VPN, and then directing traffic towards that vpn using policy based routing. 
We will be tyring to connect site A with site B (below.) We want site A to return traffic based on which interface it arives on. 
We want site B to send traffic from 172.30.1.0/28 voe the VPN tunnel, and the rest out via the default route.

In a Policy based VPN, all traffic not matching the policy will be dropped, and a standard Route based VPN will send all traffic to the destination.
This setup allows secure traffic from trusted devices to traverse the tunnel, but does not stop all other traffic from reaching the same endpoint.

The setup
---------
::

    #Side A
    Name: Side A
    Local networks: 192.168.10.0/24
    Remote networks: 172.30.1.0/24
    Local interface: 10.0.0.2
    Remote interface: 20.0.0.2
    PSK: 7raJ5QAK9cKuHR9tQeG@

    #Side B
    Name: Side A
    Local networks: 172.30.1.0/24 1
    Remote networks: 92.168.10.0/24
    Local interface: 20.0.0.2
    Remote interface: 10.0.0.2
    PSK: 7raJ5QAK9cKuHR9tQeG@


Side A
------

We will be configuring a standard route based VPN for side a. We need to create a tunnel interface, route, and tunnle. ::

    interfaces {
        vti vti0 {
            mtu 1436
        }
    }
    protocols {
        static {
            interface-route 172.30.1.0/24 {
                next-hop-interface vti0 {
                }
            }
        }
    }
    vpn {
        ipsec {
            allow-access-to-local-interface disable
            auto-firewall-nat-exclude enable
            esp-group FOO0 {
                compression disable
                lifetime 3600
                mode tunnel
                pfs enable
                proposal 1 {
                    encryption aes128
                    hash sha1
                }
            }
            ike-group FOO0 {
                ikev2-reauth no
                key-exchange ikev1
                lifetime 28800
                proposal 1 {
                    dh-group 14
                    encryption aes128
                    hash sha1
                }
            }
            site-to-site {
                peer 20.0.0.2 {
                    authentication {
                        mode pre-shared-secret
                        pre-shared-secret 7raJ5QAK9cKuHR9tQeG@
                    }
                    connection-type initiate
                    description ipsec
                    ike-group FOO0
                    ikev2-reauth inherit
                    local-address 10.0.0.2
                    vti {
                        bind vti0
                        esp-group FOO0
                    }
                }
            }
        }
    }

::

    #Create tunnel interface
    set interfaces vti vti0 mtu 1436

    #Create route
    set protocols static interface-route 172.30.1.0/24 next-hop-interface vti0

    #Create VPN tunnel
    set vpn ipsec allow-access-to-local-interface disable
    set vpn ipsec auto-firewall-nat-exclude enable
    set vpn ipsec esp-group FOO0 compression disable
    set vpn ipsec esp-group FOO0 lifetime 3600
    set vpn ipsec esp-group FOO0 mode tunnel
    set vpn ipsec esp-group FOO0 pfs enable
    set vpn ipsec esp-group FOO0 proposal 1 encryption aes128
    set vpn ipsec esp-group FOO0 proposal 1 hash sha1
    set vpn ipsec ike-group FOO0 ikev2-reauth no
    set vpn ipsec ike-group FOO0 key-exchange ikev1
    set vpn ipsec ike-group FOO0 lifetime 28800
    set vpn ipsec ike-group FOO0 proposal 1 dh-group 14
    set vpn ipsec ike-group FOO0 proposal 1 encryption aes128
    set vpn ipsec ike-group FOO0 proposal 1 hash sha1
    set vpn ipsec site-to-site peer 20.0.0.2 authentication mode pre-shared-secret
    set vpn ipsec site-to-site peer 20.0.0.2 authentication pre-shared-secret 7raJ5QAK9cKuHR9tQeG@
    set vpn ipsec site-to-site peer 20.0.0.2 connection-type initiate
    set vpn ipsec site-to-site peer 20.0.0.2 description ipsec
    set vpn ipsec site-to-site peer 20.0.0.2 ike-group FOO0
    set vpn ipsec site-to-site peer 20.0.0.2 ikev2-reauth inherit
    set vpn ipsec site-to-site peer 20.0.0.2 local-address 10.0.0.2
    set vpn ipsec site-to-site peer 20.0.0.2 vti bind vti0
    set vpn ipsec site-to-site peer 20.0.0.2 vti esp-group FOO0

Side B
------

On side B we will need to setup the VPN and the PBR. VPN configuration is almost the same as above.
To create the PBR we need to setup a firewall rule, a route table, and apply it to an interface. I am going to assume interface switch0 is internal facing.

Setup the PBR modify rules and apply to interface switch0 ::

    firewall {
        modify PBR {
            rule 10 {
                action modify
                destination {
                    address 192.168.10.0/24
                }
                modify {
                    table 1
                }
                source {
                    address 172.30.1.0/28
                }
            }
        }
    }
    interfaces {
        switch switch0 {
            address 172.30.1.0/24
            duplex auto
            firewall {
                in {
                    modify PBR
                }
            }
        }
    }

::

    #Create firewall rules
    set firewall modify PBR rule 10 action modify
    set firewall modify PBR rule 10 destination address 192.168.10.0/24
    set firewall modify PBR rule 10 modify table 1
    set firewall modify PBR rule 10 source address 172.30.1.0/28

    #Add rule to interface
    set interfaces switch switch0 firewall in modify PBR

Setup the VPN tunnel ::

    interfaces {
        vti vti0 {
            mtu 1436
        }
    }
    protocols {
        static {
            table 1 {
                interface-route 192.168.10.0/24 {
                    next-hop-interface vti0 {
                    }
                }
            }
        }
    }
    vpn {
        ipsec {
            allow-access-to-local-interface disable
            auto-firewall-nat-exclude enable
            esp-group FOO0 {
                compression disable
                lifetime 3600
                mode tunnel
                pfs enable
                proposal 1 {
                    encryption aes128
                    hash sha1
                }
            }
            ike-group FOO0 {
                ikev2-reauth no
                key-exchange ikev1
                lifetime 28800
                proposal 1 {
                    dh-group 14
                    encryption aes128
                    hash sha1
                }
            }
            site-to-site {
                peer 10.0.0.2 {
                    authentication {
                        mode pre-shared-secret
                        pre-shared-secret 7raJ5QAK9cKuHR9tQeG@
                    }
                    connection-type initiate
                    description ipsec
                    ike-group FOO0
                    ikev2-reauth inherit
                    local-address 20.0.0.2
                    vti {
                        bind vti0
                        esp-group FOO0
                    }
                }
            }
        }
    }

::

    #Create tunnel interface
    set interfaces vti vti0 mtu 1436

    #Create table 1
    set protocols static table 1 interface-route 192.168.10.0/24 next-hop-interface vti0

    #Create VPN tunnel
    set vpn ipsec allow-access-to-local-interface disable
    set vpn ipsec auto-firewall-nat-exclude enable
    set vpn ipsec esp-group FOO0 compression disable
    set vpn ipsec esp-group FOO0 lifetime 3600
    set vpn ipsec esp-group FOO0 mode tunnel
    set vpn ipsec esp-group FOO0 pfs enable
    set vpn ipsec esp-group FOO0 proposal 1 encryption aes128
    set vpn ipsec esp-group FOO0 proposal 1 hash sha1
    set vpn ipsec ike-group FOO0 ikev2-reauth no
    set vpn ipsec ike-group FOO0 key-exchange ikev1
    set vpn ipsec ike-group FOO0 lifetime 28800
    set vpn ipsec ike-group FOO0 proposal 1 dh-group 14
    set vpn ipsec ike-group FOO0 proposal 1 encryption aes128
    set vpn ipsec ike-group FOO0 proposal 1 hash sha1
    set vpn ipsec site-to-site peer 10.0.0.2 authentication mode pre-shared-secret
    set vpn ipsec site-to-site peer 10.0.0.2 authentication pre-shared-secret JmEjBXdk9kUA96!r#Hkb
    set vpn ipsec site-to-site peer 10.0.0.2 connection-type initiate
    set vpn ipsec site-to-site peer 10.0.0.2 description ipsec
    set vpn ipsec site-to-site peer 10.0.0.2 ike-group FOO0
    set vpn ipsec site-to-site peer 10.0.0.2 ikev2-reauth inherit
    set vpn ipsec site-to-site peer 10.0.0.2 local-address 20.0.0.2
    set vpn ipsec site-to-site peer 10.0.0.2 vti bind vti0
    set vpn ipsec site-to-site peer 10.0.0.2 vti esp-group FOO0


Side B complete config
----------------------
::

    firewall {
        modify PBR {
            rule 10 {
                action modify
                destination {
                    address 192.168.10.0/24
                }
                modify {
                    table 1
                }
                source {
                    address 172.30.1.0/28
                }
            }
        }
    }
    interfaces {
        switch switch0 {
            address 172.30.1.0/24
            duplex auto
            firewall {
                in {
                    modify PBR
                }
            }
        }
        vti vti0 {
            mtu 1436
        }
    }
    protocols {
        static {
            table 1 {
                interface-route 192.168.10.0/24 {
                    next-hop-interface vti0 {
                    }
                }
            }
        }
    }
    vpn {
        ipsec {
            allow-access-to-local-interface disable
            auto-firewall-nat-exclude enable
            esp-group FOO0 {
                compression disable
                lifetime 3600
                mode tunnel
                pfs enable
                proposal 1 {
                    encryption aes128
                    hash sha1
                }
            }
            ike-group FOO0 {
                ikev2-reauth no
                key-exchange ikev1
                lifetime 28800
                proposal 1 {
                    dh-group 14
                    encryption aes128
                    hash sha1
                }
            }
            site-to-site {
                peer 10.0.0.2 {
                    authentication {
                        mode pre-shared-secret
                        pre-shared-secret 7raJ5QAK9cKuHR9tQeG@
                    }
                    connection-type initiate
                    description ipsec
                    ike-group FOO0
                    ikev2-reauth inherit
                    local-address 20.0.0.2
                    vti {
                        bind vti0
                        esp-group FOO0
                    }
                }
            }
        }
    }

::

    #Create firewall rules
    set firewall modify PBR rule 10 action modify
    set firewall modify PBR rule 10 destination address 192.168.10.0/24
    set firewall modify PBR rule 10 modify table 1
    set firewall modify PBR rule 10 source address 172.30.1.0/28

    #Add rule to interface
    set interfaces switch switch0 firewall in modify PBR

    #Create tunnel interface
    set interfaces vti vti0 mtu 1436

    #Create table 1
    set protocols static table 1 interface-route 192.168.10.0/24 next-hop-interface vti0

    #Create VPN tunnel
    set vpn ipsec allow-access-to-local-interface disable
    set vpn ipsec auto-firewall-nat-exclude enable
    set vpn ipsec esp-group FOO0 compression disable
    set vpn ipsec esp-group FOO0 lifetime 3600
    set vpn ipsec esp-group FOO0 mode tunnel
    set vpn ipsec esp-group FOO0 pfs enable
    set vpn ipsec esp-group FOO0 proposal 1 encryption aes128
    set vpn ipsec esp-group FOO0 proposal 1 hash sha1
    set vpn ipsec ike-group FOO0 ikev2-reauth no
    set vpn ipsec ike-group FOO0 key-exchange ikev1
    set vpn ipsec ike-group FOO0 lifetime 28800
    set vpn ipsec ike-group FOO0 proposal 1 dh-group 14
    set vpn ipsec ike-group FOO0 proposal 1 encryption aes128
    set vpn ipsec ike-group FOO0 proposal 1 hash sha1
    set vpn ipsec site-to-site peer 10.0.0.2 authentication mode pre-shared-secret
    set vpn ipsec site-to-site peer 10.0.0.2 authentication pre-shared-secret JmEjBXdk9kUA96!r#Hkb
    set vpn ipsec site-to-site peer 10.0.0.2 connection-type initiate
    set vpn ipsec site-to-site peer 10.0.0.2 description ipsec
    set vpn ipsec site-to-site peer 10.0.0.2 ike-group FOO0
    set vpn ipsec site-to-site peer 10.0.0.2 ikev2-reauth inherit
    set vpn ipsec site-to-site peer 10.0.0.2 local-address 20.0.0.2
    set vpn ipsec site-to-site peer 10.0.0.2 vti bind vti0
    set vpn ipsec site-to-site peer 10.0.0.2 vti esp-group FOO0

Resources
----------
This should be all you need. If traffic is not passing try rebooting either or both routers.

	* `EdgeRouter - Route-Based Site-to-Site IPsec VPN <https://help.ui.com/hc/en-us/articles/115011377588-EdgeRouter-Route-Based-Site-to-Site-IPsec-VPN>`_
	* `EdgeRouter - Policy-Based Routing <https://help.ui.com/hc/en-us/articles/204952274-EdgeRouter-Policy-Based-Routing>`_
