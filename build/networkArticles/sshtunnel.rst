HTTPS over SSH tunnels
======================
Managing devices at remote sites without a VPN can be tricky. I frequently find myself needing to access devices behind a remote router, in most cases a Ubiquite Edgerouter or other unix based router. 
If both devices support SSH this is simple, SSH to the router then SSH to the end device. 
Sometimes the end device only supports HTTP or other obscure management protocols, in which case we look to SSH Tunneling.

| SSH Tunneling allows us to port forward across a ssh tunnel. Here is the command, feel free to modify as you see fit. 
| ``ssh -L [local port]:[remote device]:[remote device port] [username]@[remote ssh tunnel host]``

| For example, lets say we have a remote router, 172.16.251.2, with a device behind it that can only be managed via https at 10.16.251.11. Lets forward that https management port back across the ssh tunnel.
| ``ssh -L 8443:10.16.251.11:443 admin@172.16.251.2``
| From this point we can access the web management through our local web browser
| ``https://127.0.0.1:8443``

| Here is the same example, just with http instead of https.
| ``ssh -L 8080:10.16.251.11:80 admin@172.16.251.2``
| ``http://127.0.0.1:8080``


