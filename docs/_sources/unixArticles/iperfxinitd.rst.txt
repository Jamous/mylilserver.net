Starting Iperf3 remotely using xinitd
=====================================
Iperf3 is a great tool, however leaving it running and open to the world can be problematic. We are going to build an xinitd service that will allow us to remotely start, and shut down iperf3 using telnet or netcat. 

Start by installing xinetd: apt install xinetd
Build the new xinetd service. This service listens for inbound TCP connections on port 5200 from our trusted source range. It then starts iperf3 to run for one session. I tried to get this just to start on port 5201, the default iperf port, but it would only result in errors. Create /etc/xinetd.d/iperf3 as follows :: 

    service iperf3
    {
        port            = 5200
        socket_type     = stream
        protocol        = tcp
        wait            = no
        user            = root
        server          = /usr/bin/iperf3
        server_args     = -s -1 > /root/iperflog
        log_type        = SYSLOG daemon debug
        log_on_success  = HOST PID USERID EXIT DURATION
        log_on_failure  = HOST USERID ATTEMPT
        disable         = no
        bind            = 0.0.0.0
        one_from        = 10.0.0.0/20
    }

Add the service to /etc/services also ::

    # Local services
    iperf3          5200/tcp                        # Iperf3 service

| Now you can start the service by using telnet or netcat to probe the port, then iperf will work regularly.
| Using nc: ``nc -z 10.0.0.237 5200``
| Using telnet: ``telnet 10.0.0.237 5200``
| Start iperf: ``iperf3 -c 10.0.0.237``
