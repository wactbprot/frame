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

## start

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