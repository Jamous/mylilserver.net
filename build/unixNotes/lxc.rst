Linux Containers
================

Setup
-----
| Interactively build a new container: ``lxc-create -t download -n [container name]``
| Container files are located at: ``/var/lib/lxc/[container name]/``

Magagment
---------
| List all containers: ``lxc-ls -f``
| Start the container: ``lxc-start -n [container name]``
| Stop the container: ``lxc-stop -n [container name]``
| Restart the container: ``lxc-restart -n [container name]``
| Remove a container (must be stoped): ``lxc-destroy -n [container name]``

Accessing
---------
| Attaching, similar to directly connecting: ``lxc-attach -n [container name]``
| Console, similar to virsh console, must be enabled on the container: ``lxc-attach -n [container name]``

