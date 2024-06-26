Disabling SIP-ALG on FortiOS
============================

On FortiOS sip traffic is picked up by a session helper and processed through sip-alg. To disable sip-alg start by finding and removing the sip session-helper. This will cause sip traffic to be treated as regular traffic. We will also disable nat trace and voip profiles to be sure sip-alg is completely bypassed. This was performed on a Fortigate 60F with firmware version 7.0.15.

Disabling SIP-ALG on FortiOS
----------------------------

#### Delete sip session helper ::

    fortigate # config system session-helper
    fortigate (session-helper) # show
    config system session-helper
    …
        edit 13
            set name sip
            set protocol 17
            set port 5060
        next
    …
    fortigate (session-helper) # delete 13
    fortigate (session-helper) # end

#### Disable sip-nat-trace ::

    fortigate # config  system settings
    fortigate (settings) # set sip-nat-trace disable
    fortigate (settings) # end

#### Disable default and strict voip profiles :: 

    fortigate # config  voip profile
    fortigate (profile) # edit default
    fortigate (default) # config sip
    fortigate (sip) # set status disable
    fortigate (sip) # set rtp disable
    fortigate (sip) # end
    fortigate (profile) # end
    fortigate # config  voip profile
    fortigate (profile) # edit strict
    fortigate (strict) # config  sip
    fortigate (sip) # set status disable
    fortigate (sip) # set rtp disable
    fortigate (sip) # end


Resources
---------
	* Technical Tip: Disabling VoIP Inspection: `https://community.fortinet.com/t5/FortiGate/Technical-Tip-Disabling-VoIP-Inspection/ta-p/194131 <https://community.fortinet.com/t5/FortiGate/Technical-Tip-Disabling-VoIP-Inspection/ta-p/194131>`_
	* SIP message inspection and filtering: `https://docs.fortinet.com/document/fortigate/7.0.15/administration-guide/681177/sip-message-inspection-and-filtering <https://docs.fortinet.com/document/fortigate/7.0.15/administration-guide/681177/sip-message-inspection-and-filtering>`_
