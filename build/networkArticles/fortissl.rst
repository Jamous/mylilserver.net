Troubleshoot Fortigate IPsec VPN
================================

I have built quite a few IPsec client VPNs, and most go smoothly. During a recent deployment, building an IPsec client vpn and using SAML for authentication, I ran into some rode blocks. 
These are the diagnostic tools I used to help weed out the problems. Ill include all the diagnostic commands first, then explain what every one does. ::

    diag debug reset
    fnsysctl killall iked
    diagnose vpn ike log-filter src-addr4 [ip]
    diagnose debug application ike -1
    diagnose debug application samld -1
    diag debug app fnbamd -1
    diag debug application eap_proxy -1
    diag debug enable

| Now, lets go through these line by line
| ``diag debug reset``: resets all debug configs, in case any were currently running.
| ``fnsysctl killall iked``: This kills the IKE process on the system. This is useful to clear out any hairballs that may be lurking. Similar to pkill.
| ``diagnose vpn ike log-filter src-addr4 [ip]``: Specifies the source address we wish to see logs for in our debug console.
| ``diagnose debug application ike -1``: Sets IKE (the protocol behind IPsec) to debug mode.
| ``diagnose debug application samld -1``: Sets SAML to debug mode. Useful if using SAML authentication, does not make a difference otherwise.
| ``diag debug app fnbamd -1``: Sets fndbam to debug mode. Fnbdam is for debugging RADIUS, LDAP, and TACACS authentication.
| ``diag debug application eap_proxy -1``: Sets EAP Proxy to debug mode. This is the authentication proxy, where the fortigate is not preforming the authentication.
| ``diag debug enable``: Enables debug mode.
| ``diag debug disable``: Once complete disables the debug messages from going to console. All messages will auto stop after 30 minutes.
