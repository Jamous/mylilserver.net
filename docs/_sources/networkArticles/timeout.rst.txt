Cisco AnyConnect idle timeout
===========================================
Cisco Anyconnect Idle timout | rekeys and error checkers

Setting idle timeouts for Cisco AnyConnect can be tricky. Thankfully if approaching it from the correct angle it can be easy.

Let’s start with a simple AnyConnect config, this will be our base for this project. For my test bench I will be using a Cisco ASA 5515x and refrenceing Ciscos `AnyConnect FAQ: Tunnels, Reconnect Behavior, and the Inactivity Timer <https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/116312-qanda-anyconnect-00.html>`_ documentation. :sup:`1`


We will be looking at the ‘anyconnect-group-policy’. Your group policy may be different, and your names may change. ::

        ip local pool vpn-pool 192.168.1.1-192.168.1.254 mask 255.255.255.0
        !
        access-list split-acl standard permit 192.168.0.0 255.255.255.0
        !
        group-policy anyconnect-group-policy internal
        group-policy anyconnect-group-policy attributes
         dns-server value 192.168.0.1
         vpn-tunnel-protocol ssl-client
         split-tunnel-policy tunnelspecified
         split-tunnel-network-list value split-acl
         webvpn
          anyconnect ssl keepalive none
          !
        tunnel-group TEST-TUNNEL type remote-access
        tunnel-group TEST-TUNNEL general-attributes
        default-group-policy anyconnect-group-policy
        address-pool default vpn-pool

.. note::
        AnyConnect ssl keepalive will, as the name implies, keep the connection open. We will want to turn this off. The proper way to do this is ::
            
            Group-policy anyconnect-group-policy attributes
             webvpn
              Anyconnect ssl keepalive none

Our starting code does not contain any type of timeout. This connection will stay up as long as the machine is not asleep. Our objective here is to set a 15 minute idle timeout, so let’s look at how we do that.

The simple answer is to add a vpn idle timeout. ::

        group-policy anyconnect-group-policy attributes
         vpn-idle-timeout 15

In this instance idle is defined as any traffic sent across the tunnel. We are only capturing traffic going to the 192.168.0.0/24 subnet, any other traffic will be ignored.

A user can be actively using thire machine, and as long as they are not accessing resources behind that network the VPN will time out.

Approximate time from idle to timeout: 15 minutes.

While this approach works, its has one glaring problem, it is missing local DNS. If that is something you can live without, great, otherwise we will need to specify a DNS server on the AnyConnect connection.

Let’s add 192.168.0.1 as the DNS server. ::

        group-policy anyconnect-group-policy attributes
         dns-server value 192.168.0.1

Now 192.168.0.1 will act as the primary DNS server for any machine connected via AnyConnect. Any DNS queries will travel across the tunnel, keeping it active even if no vpn resources are currently being accessed. There are usually dns queries going on in the background that will keep the tunnel active after the machine goes “idle”. In field experience, this amounts to roughly 3 minutes. To accommodate for this we will adjust the idle timeout value by 3 minutes. Thankfully the 3 minute rule of thumb appears to stay the same even as you scale the time up and down. ::

        group-policy anyconnect-group-policy attributes
         vpn-idle-timeout

Let’s calculate our current idle timeout values. To make this simple, we will assume DNS lookups will continue 3 minutes after idle as the DNS offset. ::

        Let T be time until VPN timeout
        Average T = Timeout value + DNS offset
        15 = 12 + 3
        Average T = 15

Our group-policy should look something like this now. ::

        group-policy anyconnect-group-policy attributes
         vpn-idle-timeout 12
         vpn-tunnel-protocol ssl-client
         split-tunnel-policy tunnelspecified
         split-tunnel-network-list value split-acl
         webvpn
          anyconnect ssl keepalive none

You can stop at this point, however it leaves out a few very useful features.

SSL Dead Peer Detection (DPD) checks for dead peers, usually your host ASA on your AnyConnect session. DPD will generate traffic at regular intervals during the VPN session. This traffic will reset the idle timeout counter. The DPD time value has to be higher than the idle timeout, otherwise DPD traffic will keep the tunnel open indefinitely. Why do I need DPD?

Because DPD is measured in seconds, we will set its value to 1200, or 20 minutes ::

        group-policy anyconnect-group-policy attributes
         webvpn
          anyconnect dpd-interval client 1200


Let’s recalculate that timeout interval ::

        Let T be time until VPN timeout
        Min T = Timeout Value
        12 = 12
        Max T = Timeout value + Timeout value + DNS offset
        27 = 12 + 12 + 3
        Average T = Timeout value + DNS offset
        15 = 12 + 3
        Average T = 15

But were not done yet, let’s also add SSL Rekeys onto our profile. An SSL Rekey changes the SSL key mid-session. This can help prevent a man-in-the-middle attack from snooping on encrypted data. SSL Rekeys are measured in minutes. A rekey is recommended at 30 minute intervals, so we will do 30 minutes. Keep in mind that the rekey must be longer than the timeout period, otherwise it will keep the session open.

We can see that our average timeout is still going to be 15 minutes. Assuming that DPD will generate traffic during this time period we now have a timeout window between 12 and 27 minutes, with an average of 15. ::

        
        group-policy anyconnect-group-policy attributes
         webvpn
          anyconnect ssl rekey method ssl
          anyconnect ssl rekey time 30

One last time, let’s recalculate the timeout interval, which does not change. ::

        Let T be time until VPN timeout
        Min T = Timeout Value
        12 = 12
        Max T = Timeout value + Timeout value + DNS offset
        27 = 12 + 12 + 3
        Average T = Timeout value + DNS offset
        15 = 12 + 3
        Average T = 15


This will result in AnyConnect timing out between 12 and 27 minutes of inactivity, with an average of 15. ::

        
        ip local pool vpn-pool 192.168.1.1-192.168.1.254 mask 255.255.255.0
        !
        access-list split-acl standard permit 192.168.0.0 255.255.255.0
        !
        group-policy anyconnect-group-policy internal
        group-policy anyconnect-group-policy attributes
         dns-server value 192.168.0.1
         vpn-idle-timeout 12
         vpn-tunnel-protocol ssl-client
         split-tunnel-policy tunnelspecified
         split-tunnel-network-list value split-acl
         webvpn
          anyconnect ssl keepalive none
          anyconnect dpd-interval client 60
          anyconnect ssl rekey method ssl
          anyconnect ssl rekey time 30
        !
        tunnel-group TEST-TUNNEL type remote-access
        tunnel-group TEST-TUNNEL general-attributes
         default-group-policy anyconnect-group-policy
         address-pool default vpn-pool

For further reference the original cisco documentation can be viewed here

* :sup:`1` https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/116312-qanda-anyconnect-00.html

For further discussion this post can be found on Cisco community here

* https://community.cisco.com/t5/vpn/cisco-anyconnect-idle-timeout-troubleshooting/td-p/4392646
