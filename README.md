```
                                       
 ,---.                                 
/  .-',--.--. ,--,--.,--,--,--. ,---.  
|  `-,|  .--'' ,-.  ||        || .-. : 
|  .-'|  |   \ '-'  ||  |  |  |\   --. 
`--'  `--'    `--`--'`--`--`--' `----' 
```

___frame___ 

* ... is a client for [ssmp](/../../../../vaclab/ssmp)
* ... uses polling for (demonstration reasons) 
* ... works with [bootsrtap](http://getbootstrap.com)



## installation

```
~/> git clone git@a75436.berlin.ptb.de:thomas.bock/frame.git
~/> cd frame
~/frame> npm install frame
```


## Starten

frame ist ein frame um ssmp; d.h. starten von frame macht nur bei laufendem
ssmp Sinn.

### systemctrl

Auf den  Messrechnern wird der service automatisch beim Booten über systemctrl
gestartet. ```stop```, ```start``` oder ```restart``` geht dann wie üblich über:

```
$> systemctl stop 
$> systemctl start
$> systemctl restart

```

Die aktuellen Logausgaben erhält man mittels:

```
$> journalctl -u ssmp -f
```


### manuell

```
~/frame> npm start
```

## url


```
http://server:port/<mpid>/<container>/[<state>|<elements>]/frame
```

Bsp.:
http://localhost:8002/mpd-test-wait/0/elements/frame


## scheme of the entire system

```

                           +---------------+
                           |   node-relay  |
                           |---------------|             +--------------+
                           |               |     TCP     |              |
                           |               +-----VXI-----+   Devices    |
                           |               |     UDP     |              |
                           +--------+------+             +--------------+
                                    |
                                    |
                                http/json
                                    |
   +-------------+           +------+-----+
   |  CouchDB    |           |  ssmp      |
   |-------------|           |------------| 
   |             +-http/json-+            |
   |             |           |            |
   |             |           |            |
   +-------------+           +----+-- ----+
                                  |
                                  |
                              http/json
                                  |
                            +-----+-------+
                            |  frame      |
                            |-------------|              +--------------+
                            |             |<--http/val---+              |
                            |             |              |   Browser    |
                            |             +--http/html5->|              |
                            +-------------+              +--------------+

```