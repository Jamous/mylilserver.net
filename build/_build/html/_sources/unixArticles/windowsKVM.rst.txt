Boot windows as KVM on serprate HDD
===================================

This article is about mounting a secondary hard drive as a disk for a KVM vm. The advantages of this include being able to dual boot a system, and run one system as a vm within another.
In my setup Windows 10 is installed on the factory m.2 mvne drive, with Debian 12 on a septate SSD. During the setup of Debian I removed the nmve drive to make sure each disk has its own uefi boot partition.
Because there are two seperate boot partitions, we wont need to do anything special, we can just point the kvm to use the disk directly.

Here my disk is named ``/dev/nvme0n1``

We need to enable ipv4 and ipv6 forwarding. Uncomment these two lines in /etc/sysctl.conf ::

 sudo nano /etc/sysctl.conf
 net.ipv4.ip_forward=1
 net.ipv6.conf.all.forwarding=1


| Reload system config for this to take effect. 
| ``sudo sysctl --system```


We are going to setup a network bridge. Add this to ``/etc/network/interfaces``, then restart the service with ``sudo systemctl restart networking`` ::

  # The bridge interface
  auto br0
  iface br0 inet dhcp
      bridge_ports enp3s0
      bridge_stp off
      bridge_fd 0
      bridge_maxwait 0


Virsh config ::

  <domain type='kvm' id='3'>
    <name>windows10</name>
    <uuid>ad49edea-f888-432a-aa2c-0721938eca4c</uuid>
    <memory unit='KiB'>12582912</memory>
    <currentMemory unit='KiB'>12582912</currentMemory>
    <vcpu placement='static'>4</vcpu>
    <resource>
      <partition>/machine</partition>
    </resource>
    <os>
      <type arch='x86_64' machine='pc-q35-6.1'>hvm</type>
      <loader readonly='yes' type='pflash'>/usr/share/OVMF/OVMF_CODE.fd</loader>
      <nvram>/var/lib/libvirt/qemu/nvram/win10_VARS.fd</nvram>
      <boot dev='hd'/>
    </os>
    <features>
      <acpi/>
      <apic/>
      <hyperv mode='custom'>
        <relaxed state='on'/>
        <vapic state='on'/>
        <spinlocks state='on' retries='8191'/>
      </hyperv>
      <kvm>
        <hidden state='on'/>
      </kvm>
      <vmport state='off'/>
    </features>
    <cpu mode='host-passthrough' check='none' migratable='on'>
      <topology sockets='1' dies='1' cores='4' threads='1'/>
      <numa>
        <cell id='0' cpus='0-3' memory='12582912' unit='KiB'/>
      </numa>
    </cpu>
    <clock offset='localtime'>
      <timer name='rtc' tickpolicy='catchup'/>
      <timer name='pit' tickpolicy='delay'/>
      <timer name='hpet' present='no'/>
    </clock>
    <on_poweroff>destroy</on_poweroff>
    <on_reboot>restart</on_reboot>
    <on_crash>destroy</on_crash>
    <devices>
      <emulator>/usr/bin/qemu-system-x86_64</emulator>
      <disk type='block' device='disk'>
        <driver name='qemu' type='raw' cache='none'/>
        <source dev='/dev/nvme0n1' index='1'/>
        <backingStore/>
        <target dev='sda' bus='sata'/>
        <alias name='sata0-0-0'/>
        <address type='drive' controller='0' bus='0' target='0' unit='0'/>
      </disk>
      <controller type='usb' index='0' model='ich9-ehci1'>
        <alias name='usb'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x05' function='0x7'/>
      </controller>
      <controller type='pci' index='0' model='pcie-root'>
        <alias name='pcie.0'/>
      </controller>
      <controller type='pci' index='1' model='pcie-root-port'>
        <model name='pcie-root-port'/>
        <target chassis='1' port='0x8'/>
        <alias name='pci.1'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0' multifunction='on'/>
      </controller>
      <controller type='pci' index='2' model='pcie-to-pci-bridge'>
        <model name='pcie-pci-bridge'/>
        <alias name='pci.2'/>
        <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
      </controller>
      <controller type='pci' index='3' model='pcie-root-port'>
        <model name='pcie-root-port'/>
        <target chassis='3' port='0x9'/>
        <alias name='pci.3'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x1'/>
      </controller>
      <controller type='virtio-serial' index='0'>
        <alias name='virtio-serial0'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x06' function='0x0'/>
      </controller>
      <controller type='sata' index='0'>
        <alias name='ide'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x1f' function='0x2'/>
      </controller>
      <controller type='sata' index='1'>
        <alias name='sata1'/>
        <address type='pci' domain='0x0000' bus='0x02' slot='0x01' function='0x0'/>
      </controller>
      <interface type='bridge'>
        <mac address='52:54:00:4b:0d:cc'/>
        <source bridge='br0'/>
        <target dev='vnet2'/>
        <model type='virtio'/>
        <alias name='net0'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x03' function='0x0'/>
      </interface>
      <serial type='pty'>
        <source path='/dev/pts/2'/>
        <target type='isa-serial' port='0'>
          <model name='isa-serial'/>
        </target>
        <alias name='serial0'/>
      </serial>
      <console type='pty' tty='/dev/pts/2'>
        <source path='/dev/pts/2'/>
        <target type='serial' port='0'/>
        <alias name='serial0'/>
      </console>
      <channel type='unix'>
        <source mode='bind' path='/var/lib/libvirt/qemu/channel/target/domain-3-windows10/org.qemu.guest_agent.0'/>
        <target type='virtio' name='org.qemu.guest_agent.0' state='disconnected'/>
        <alias name='channel0'/>
        <address type='virtio-serial' controller='0' bus='0' port='1'/>
      </channel>
      <input type='mouse' bus='ps2'>
        <alias name='input0'/>
      </input>
      <input type='keyboard' bus='ps2'>
        <alias name='input1'/>
      </input>
      <graphics type='vnc' port='5900' autoport='yes' listen='127.0.0.1'>
        <listen type='address' address='127.0.0.1'/>
      </graphics>
      <audio id='1' type='none'/>
      <video>
        <model type='cirrus' vram='16384' heads='1' primary='yes'/>
        <alias name='video0'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x0'/>
      </video>
      <memballoon model='virtio'>
        <alias name='balloon0'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x07' function='0x0'/>
      </memballoon>
    </devices>
    <seclabel type='dynamic' model='apparmor' relabel='yes'>
      <label>libvirt-ad49edea-f888-432a-aa2c-0721938eca4c</label>
      <imagelabel>libvirt-ad49edea-f888-432a-aa2c-0721938eca4c</imagelabel>
    </seclabel>
    <seclabel type='dynamic' model='dac' relabel='yes'>
      <label>+64055:+64055</label>
      <imagelabel>+64055:+64055</imagelabel>
    </seclabel>
  </domain>
