Containerlab notes
==================

Bring up a lab ::

	containerlab deploy

Bringing down a lab ::

	containerlab destroy

Managing images
---------------
| All images are docker images. You can mnnage them as below.
| Listing images 

::

	root@r620:~# docker images
	REPOSITORY                            TAG        IMAGE ID       CREATED          SIZE
	vrnetlab/cisco_vios                   15.6.7     c2639dfa6e6d   37 minutes ago   545MB

Removing images ::

	docker rmi c2639dfa6e6d

Saving an image ::

	docker save c2639dfa6e6d | gzip > docker_cisco_vios_15_6_7.tar.gz

Cisco vios
----------
| Username: ``admin``
| Password: ``admin``
| cisco.clab.yaml 

::

    name: cisco

    topology:
      nodes:
        vios:
          kind: linux
          image: vrnetlab/cisco_vios:15.6.7
          env:
            HOSTNAME: vios

    links:
        - endpoints: ["vios:eth1"]

Documentation: `https://github.com/hellt/vrnetlab/tree/master/vios <https://github.com/hellt/vrnetlab/tree/master/vios>`_

Juniper vMX
-----------
| Username ``admin``
| Password ``admin@123``
| vmx.clab.yml

 :: 

    name: vmx

    topology:
      nodes:
        vmx:
          kind: juniper_vmx
          image: vrnetlab/juniper_vmx:21.2R3.8

    links:
        - endpoints: ["vmx:eth1"]

Documentation `https://github.com/hellt/vrnetlab/tree/master/vmx <https://github.com/hellt/vrnetlab/tree/master/vmx>`_

