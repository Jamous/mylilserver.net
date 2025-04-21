Removing unused locations from LibreNMS
=======================================

When adding a device into LibreNMS it will create a location entry at the time of discovery. 
While you can change this later on for each device, the old location can still be seen when filtering for devices. 
To correct this we need to log into the MariaDB instance LibreNMS uses, and remove undesired locations.

Begin by logging into MariaDB from the LibreNMS server. We will query the locations table to see every location that is avaliable. ::

	mysql
	use librenms;
	select * from locations; 

Your output will look something like this. Now we just need to grab the id of the location we want to remove, and remove it. ::

    MariaDB [librenms]> select * from locations;
    +----+----------------------------+------+------+---------------------+-------------------+
    | id | location                   | lat  | lng  | timestamp           | fixed_coordinates |
    +----+----------------------------+------+------+---------------------+-------------------+
    |  1 | unknown                    | NULL | NULL | 2024-06-14 19:20:04 |                 0 |
    |  2 | site_1                     | NULL | NULL | 2024-06-14 19:20:14 |                 0 |
    |  3 | site_2                     | NULL | NULL | 2024-06-14 19:40:07 |                 0 |
    +----+----------------------------+------+------+---------------------+-------------------+
    3 rows in set (0.001 sec)

Here we want to remove the unknown location, we will grab its id and remove it. ::

    delete from locations where id = 1;

Thats it, your done!
