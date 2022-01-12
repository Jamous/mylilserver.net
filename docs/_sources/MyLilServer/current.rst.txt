Current MyLilServer.net
===========================================

This site has evolved and changed multiple times. It is currently hosted on github pages but has previously been hosted locally and both Ubuntu and Debian. You can see notes on this below.

Most of the articles I will publish will either be personal projects or guides which will be open to peer review. I have been using Fedora at home for a while and working with CentOS servers for almost 2 years, so developing this site on CentOS 8 was a natural choice. The first iteration was hosted in wordpress, and while it looked nice I was not quite getting the visual aesthetic I was looking for. This iteration is written in ReStructuredText and compiled using sphinx. You can select “View page source” in the upper right hand corner on any page to see the RST files. I will also include some great Sphinx resources below.

This site was originally deployed in CentOS 8. However, with CentOS 8 will reach EOL in 2021 this server has been migrated to Centos 8 Stream in the hope that Stream will still provide a stable web hosting platform.

This is also my first successful site to use SSL certs, provided by DigiCert.

The server is physically hosted in my laundry room. All work on this server, including designing the website, are done via SSH. To connect to the server I have a SSL client vpn into my home network.

.. image:: _static/Rack_1.jpg
.. image:: _static/Rack_2.jpg
.. image:: _static/Rack_build.jpg
.. image:: _static/Server_1.jpg
.. image:: _static/Server_2.jpg


| `Getting Started with Sphinx <https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html>`_
| `Read the Docs Sphinx Theme <https://sphinx-rtd-theme.readthedocs.io/en/stable/>`_
| `reStructuredText Primer <https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html>`_
| `GitHub pages <https://pages.github.com>`_
