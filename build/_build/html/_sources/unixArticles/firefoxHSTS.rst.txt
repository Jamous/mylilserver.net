Clear Firefox HSTS Cache
========================

Firefox has started blocking some sites with the error below. If you cant bypass this error it means the website is listed in the Firefox HSTS cache. 
To fix this you can either remove or edit the cache. ::

	MOZILLA_PKIX_ERROR_SELF_SIGNED_CERT

Linux example: ::

    find ~/.mozilla/firefox -type f -name "SiteSecurityServiceState.bin" -exec rm -v {} \;

Windows example: ::
	
	Get-ChildItem "$env:APPDATA\Mozilla\Firefox\Profiles" -Recurse -Filter "SiteSecurityServiceState.bin" | Remove-Item -Verbose
 

