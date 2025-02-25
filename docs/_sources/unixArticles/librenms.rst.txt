Librenms: Directly querying mysql database
===========================================
| You can troubleshoot librenms alert rules directly inside of the mysql database.
| To enter librenms mysql database, as root launch mysql, then enter the librenms database. 

::

    mysql
    use librenms;

From here you can get your device ID, and then querry against that device. Alert rules use a ``?``, you have to replace this. ``?`` is usually in place of a device id. ::

    SELECT device_id, hostname FROM devices;
    SELECT * FROM devices,services WHERE (devices.device_id = 61 AND devices.device_id = services.device_id) \G;


Full output ::

    root@vm-librenms ~ # mysql
    Welcome to the MariaDB monitor.  Commands end with ; or \g.
    Your MariaDB connection id is 46591
    Server version: 10.11.6-MariaDB-0+deb12u1-log Debian 12

    Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    MariaDB [(none)]> USE librenms;
    Reading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A

    Database changed
    MariaDB [librenms]> SELECT device_id, hostname FROM devices;
    +-----------+------------------------------+
    | device_id | hostname                     |
    +-----------+------------------------------+
    |        61 | imail04.bnt.com              |
    +-----------+------------------------------+
    1 row in set (0.001 sec)

    MariaDB [librenms]> SELECT * FROM devices,services WHERE (devices.device_id = 61 AND devices.device_id = services.device_id) \G;
    *************************** 1. row ***************************
                    device_id: 61
                    inserted: 2024-06-19 10:23:32
                    hostname: mail
                    sysName: mail_example
                    display: NULL
                        ip: 192.168.0.29
                    overwrite_ip:
                    community: NULL
                    authlevel: NULL
                    authname: NULL
                    authpass: NULL
                    authalgo: NULL
                cryptopass: NULL
                cryptoalgo: NULL
                    snmpver: v2c
                        port: 161
                    transport: udp
                    timeout: NULL
                    retries: NULL
                snmp_disable: 1
                bgpLocalAs: NULL
                sysObjectID: NULL
                    sysDescr: NULL
                sysContact: NULL
                    version: NULL
                    hardware:
                    features: NULL
                location_id: NULL
                        os: windows
                    status: 1
                status_reason:
                    ignore: 0
                    disabled: 0
                    uptime: NULL
                agent_uptime: 0
                last_polled: 2025-02-25 10:51:15
        last_poll_attempted: NULL
        last_polled_timetaken: 1.3264119625092
    last_discovered_timetaken: 0
            last_discovered: 2025-02-25 07:50:23
                    last_ping: 2025-02-25 10:51:15
        last_ping_timetaken: 251
                    purpose: Server 2019
                        type: server
                    serial: NULL
                        icon: NULL
                poller_group: 0
        override_sysLocation: 0
                        notes: NULL
        port_association_mode: 3
                    max_depth: 0
            disable_notify: 0
                ignore_status: 0
                service_id: 2
                    device_id: 61
                service_ip: 192.168.1.29
                service_type: smtp
                service_desc: Check if SMTP is alive
                service_param:
            service_ignore: 0
            service_status: 0
            service_changed: 1739752202
            service_message: SMTP OK - 0.262 sec. response time
            service_disabled: 0
                service_ds: {"time":"s"}
        service_template_id: 0
                service_name: imail04 SMTP check
    1 rows in set (0.001 sec)

    MariaDB [librenms]>
