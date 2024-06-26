Virsh notes
===========
Commands
--------
| List all VMs ``virsh list --all``
| Start a vm ``virsh start [vm name]``
| Stop a vm ``virsh destroy [vm name]``
| Remove a vm (does not remove .vmdk) ``virsh undefine [vm name]``
| Create a vm ``virsh define [vm name].xml``

Create and resize kvm image
---------------------------
| Create KVM image ``qemu-img create -f raw vm-example.img 20G``
| Resize KVM image ``qemu-img resize vm-example.img +30G``

Build vm
---------
| Build a vm named vm-example, mount debian 12 iso and connect to bridge br0 ::

	virt-install --name vm-example --osinfo debian11 --ram 2048 --vcpus 2 --disk path=/root/vm-example/vm-example.img,bus=virtio,size=20 --graphics none --cdrom /root/iso/debian-12.5.0-amd64-DVD-1.iso --network bridge:br0


Setup new VM
------------
| Attach disk, enable VNC, and set boot order after setup (virsh edit [vm name]). Add these into the xml file. Disable vnc and remove iso after completion.
| #### Attach disk ::

.. code-block:: xml

    <devices>
        <disk type='file' device='cdrom'>
        <driver name='qemu' type='raw'/>
        <source file='/root/iso/debian-12.5.0-amd64-DVD-1.iso'/>
        <target dev='sda' bus='sata'/>
        <readonly/>
        <address type='drive' controller='0' bus='0' target='0' unit='0'/>
        </disk>
    </devices>


#### Enable VNC (virsh edit [vm name]) ::

    <devices>
        <graphics type='vnc' port='-1' autoport='yes' listen='0.0.0.0' keymap='en-us'/>
    </devices>


#### Add cdrom into boot order ::

    <os>
        <boot dev='cdrom'/>
    </os>


#### VNC into machine and finish setup
``virsh domdisplay vm-name``

Creating  a VM from an existing template
----------------------------------------
| The steps for this are the same as above, however make these changes to the template
| #Change vm name
| #Change UUID - randomize
| #Change RAM
| #Change CPU
| #Change hdd location
| #Increment mac address by one or change to reflect vlan

Fix Debian bridge forwarding issues
-----------------------------------
| While setting up a virtual machinge on Debian 12 using KVM/Libvrt and Virsh I found that all of my VMs could connect via IPv6, but not via IPv4. I found the solution was to uncomment these two lines in /etc/sysctl.conf
| ``net.ipv4.ip_forward=1``
| ``net.ipv6.conf.all.forwarding=1``
