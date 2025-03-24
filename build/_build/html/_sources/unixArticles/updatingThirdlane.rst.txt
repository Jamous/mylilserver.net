Updating Thirdlane PBX
======================

Once installed, Thirdlane provides their own update repositories for pbx their PBX software.
You can update an install as seen below ::

	yum clean all
	yum update 


This will include release upgrades. You can see what resale versions this will bring you to by looking at the ``pbxmw-mt`` package. 
For example, below we will refresh all repositories and then look for the next installation candidate. In this example we want to update from Thirdlane version 14.3.1 to 15.1.2. ::

    yum clean all
    yum make
    yum list pbxmw-mt --showduplicates

::

    root@thirdlane ~ # yum clean all
    80 files removed
    root@thirdlane ~ # yum makecache 
    CentOS / Red Hat Enterprise Linux  - thirdlane.com            2.6 MB/s | 1.1 MB     00:00    
    CentOS / Red Hat Enterprise Linux  - thirdlane.com - Common P 709 kB/s | 314 kB     00:00    
    CentOS / Red Hat Enterprise Linux  - thirdlane.com - Firmware  14 kB/s | 2.6 kB     00:00    
    AlmaLinux 8 - BaseOS                                           29 MB/s |  19 MB     00:00    
    AlmaLinux 8 - AppStream                                        40 MB/s |  17 MB     00:00    
    AlmaLinux 8 - Extras                                          130 kB/s |  14 kB     00:00    
    AlmaLinux 8 - HighAvailability                                5.6 MB/s | 1.5 MB     00:00    
    AlmaLinux 8 - Plus                                            2.0 kB/s | 257  B     00:00    
    AlmaLinux 8 - PowerTools                                       20 MB/s | 4.4 MB     00:00    
    Extra Packages for Enterprise Linux 8 - x86_64                8.1 MB/s |  14 MB     00:01    
    Metadata cache created.
    root@thirdlane ~ # yum list pbxmw-mt --showduplicates 
    Last metadata expiration check: 0:02:18 ago on Mon 24 Mar 2025 02:19:52 PM EDT.
    Installed Packages
    pbxmw-mt.noarch                          14.3.1-54.6.el8                            @thirdlane
    Available Packages
    pbxmw-mt.noarch                          14.3.1-54.6.el8                            thirdlane 
    pbxmw-mt.noarch                          15.1.1-117.3.el8                           thirdlane 
    pbxmw-mt.noarch                          15.1.1-117.4.el8                           thirdlane 
    pbxmw-mt.noarch                          15.1.2-8.1.el8                             thirdlane 
    root@thirdlane ~ # 

Since we see 15.1.2 in the list we know we can update to 15.1.2 using yum.	
