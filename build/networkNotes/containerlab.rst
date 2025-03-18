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

| Documentation: 
| `containerlab vios <https://containerlab.dev/rn/0.58/#cisco-vios>`_
| `vrnetlab vios <https://github.com/hellt/vrnetlab/tree/master/vios>`_


Fortigate
---------
| Username: ``admin``
| Password: ``admin``
| fortigate.clab.yml

::

    name: fortigate

    topology:
      nodes:
        fortigate:
          kind: fortinet_fortigate
          image: vrnetlab/vr-fortios:7.0.15

      links:
        - endpoints: ["fortigate:eth1", "fortigate:eth2"]

| Documentation:
| `containerlab fortigate <https://containerlab.dev/manual/kinds/fortinet_fortigate/>`_
| `vrnetlab fortigate <https://github.com/hellt/vrnetlab/tree/master/fortigate>`_

Juniper vMX
-----------
| Username: ``admin``
| Password: ``admin@123``
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

| Documentation 
| `containerlab vmx <https://containerlab.dev/manual/kinds/vr-vmx/>`_
| `vrnetlab vmx <https://github.com/hellt/vrnetlab/tree/master/vmx>`_


Ubuntu
------
| Username: ``clab``
| Password: ``clab@123``
| ubuntu.clab.yml

::

    name: ubuntu
    
    topology:
      nodes:
        ubuntu:
          kind: generic_vm
          image: vrnetlab/canonical_ubuntu:jammy

      links:
        - endpoints: ["ubuntu:eth1"]

| Documentation
| `containerlab ubuntu <https://containerlab.dev/manual/kinds/generic_vm/>`_
| 'vrnetlab ubuntu <https://github.com/hellt/vrnetlab/tree/master/ubuntu>`_
