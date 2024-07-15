OpenVPN on Thirdlane PBX server for Yealink phones
==================================================

In this article we are going to install OpenVPN on a Thirdlane PBX server. The server will be Alma Linux 8, the perfered distribution for Thirdlane PBX at the time of writing this article.

Installing and configuring OpenVPN
----------------------------------
## Install and enable EPEL, then install openvpn and cd to /etc/openvpn/server. Check update will just update the repos without installing packages, you can substitute dnf update if you like. ::

    dnf install epel-release -y
    dnf check-update
    dnf install openvpn easy-rsa -y
    cd /etc/openvpn/server

## Setup new PKI and generate dh key pair and root ca cert. build-ca requires a password, you will need this to interact with the CA, keep it in a secure place. ::

    /usr/share/easy-rsa/3.0.8/easyrsa init-pki
    /usr/share/easy-rsa/3.0.8/easyrsa gen-dh
    /usr/share/easy-rsa/3.0.8/easyrsa build-ca

## Generate server and client certs and keys. These commands are all interactive and will need to be entered one at a time. ::

    /usr/share/easy-rsa/3.0.8/easyrsa gen-req server nopass
    /usr/share/easy-rsa/3.0.8/easyrsa sign-req server server
    /usr/share/easy-rsa/3.0.8/easyrsa gen-req client nopass
    /usr/share/easy-rsa/3.0.8/easyrsa sign-req client client

## Configure /etc/openvpn/server/server.conf as follows, you can change the server ip range. ::

    local 10.0.0.61
    port 1194
    proto udp
    dev tun
    cipher AES-128-CBC
    push "dhcp-option DNS 10.8.0.1"
    ca /etc/openvpn/server/pki/ca.crt
    cert /etc/openvpn/server/pki/issued/server.crt
    key /etc/openvpn/server/pki/private/server.key
    dh /etc/openvpn/server/pki/dh.pem
    server 10.8.0.0 255.255.255.0
    ifconfig-pool-persist ipp.txt
    client-to-client
    keepalive 10 120
    persist-key
    persist-tun
    status openvpn-status.log
    verb 3
    tls-version-min 1.0
    management 127.0.0.1 5555
    duplicate-cn

## Test server config, there should be no issues at this point. ::

    openvpn --config /etc/openvpn/server/server.conf --verb 3

## Start and enable the openvpn service. the "server" after the @ is the name of the config file (server.conf). ::

    systemctl enable --now openvpn-server@server
    systemctl status openvpn-server@server

Installing and configuring dnsmask
----------------------------------
| ## We will setup a dnsmask server on the PBX server to push the new DNS address to clients.
| ## Install dnsmasq 

::

    dnf install dnsmasq -y
    nano /etc/dnsmasq.conf

## Add this line to the end of /etc/dnsmasq.conf. This will be the dns record we push to the phones. You can add multiple records here. ::

    # DNS entry to redirect PBX traffic
    address=/pbx2.bnt.com/10.192.61.1

## Start and enable dnsmask service ::

    systemctl enable --now dnsmasq.service
    systemctl status dnsmasq.service


Open up iptables firewalld
--------------------------
## Alma linux 8 uses firewalld by default, thirdlane disables this in favor of iptables. Lets make a backup of the current iptables and then edit the file. ::

    cp /etc/sysconfig/iptables /etc/sysconfig/iptables.back
    nano /etc/sysconfig/iptables

## Add these lines near the end of the file, before the final commit ::

    # Allow connections to Openvpn and dns ports
    -A INPUT -p udp --dport 1194 -j ACCEPT
    -A INPUT -p udp -s 10.192.61.0/24 --dport 53 -j ACCEPT

## Restart iptables and verify changes ::

    systemctl restart iptables
    iptables -L


Setup Yealink OpenVPN client config
-----------------------------------
## Setup the directory for client config. The folder structure of this directory is very important. The config file must also be called vpn.cnf. ::

    cd /etc/openvpn/server/
    mkdir client
    cd client
    mkdir keys

## Copy keys to client folder ::

    cp /etc/openvpn/server/pki/ca.crt /etc/openvpn/server/client/keys/
    cp /etc/openvpn/server/pki/issued/client.crt /etc/openvpn/server/client/keys/
    cp /etc/openvpn/server/pki/private/client.key /etc/openvpn/server/client/keys/

## Configure /etc/openvpn/server/client/vpn.cnf ::

    client
    dev tun
    proto udp
    remote 216.252.192.61 1194
    resolv-retry infinite
    nobind
    persist-key
    persist-tun
    ca /config/openvpn/keys/ca.crt
    cert /config/openvpn/keys/client.crt
    key /config/openvpn/keys/client.key
    remote-cert-tls server
    cipher AES-128-CBC
    verb 3

## Package up client files ::

    cd /etc/openvpn/server/client
    tar -cvpf openvpn.tar *

## Next export the opnevpn.tar file. You will upload this to the phone. ::

    tar -cvpf openvpn.tar *

## To setup the VPN on the pnone, navigate to Network, advanced, enable VPN and set to OpenVPN if available. Phones without the OpenVPN option use it by default. Browse for the openvpn.tar file and upload. The phone may prompt you to reboot, select yes. Save the config and reboot the phone (Settings - Upgrade - Reboot).


This has been tested with Yealink t27p, t27g, and t53w phones.
