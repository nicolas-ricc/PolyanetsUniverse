# Multiverse challenge

This project is written in Typescript and bundled with SWC.
The only external library used is axios (which works similar to the native fetch, just avoiding the inconvenience of parsing responses).

Running each phase will generate an html file with the final multiverse.

Running Phase two will also run all the GET, POST and DELETE calls necessary to make the remote look like the local map. Since the soloons and comeths are based on Math.random to decide both their existence and properties, they will always change. 

There is also the possibility of deleting everything from the remote board using the clean command. 

Sending the remote calls for phase one (as well as cleaning its board) is not possible since only one goal is available at each time for a candidate id.



