# Multiverse challenge

This project is written in Typescript and bundled with SWC.

The only external library used is axios (which works similar to the native fetch, just avoiding the inconvenience of parsing responses).

All figures are created programatically, using the mathematical properties of the shapes.

For **Phase 1**, the cross is created "painting" the diagonals for the 80% of the square size. This will work for any square with sides of an even size.

For **Phase 2** things get tricky. The script creates the upper side of the flower petal using the relation between the row and column indexes, always ensuring there will be two parts of it: a first half with a horizontal pattern and a second half with a vertical pattern. It then mirrors to create the full petal, and again to create the other three. At the end, it adds the soloons and comeths according to the given logic.

Running each phase will generate an html file with the final multiverse, as seen below:
- [Phase 1](lib/Phase1/crossGen.html "download")
- [Phase 2](lib/Phase2/flowerGen.html "download")

Running Phase two will also run all the GET, POST and DELETE calls necessary to make the remote look like the local map. Since the soloons and comeths are based on Math.random to decide both their existence and properties, they will always change. 

There is also the possibility of deleting everything from the remote board using the clean command. 

Sending the remote calls for phase one (as well as cleaning its board) is not possible since only one goal is available at each time for a candidate id.

Commands: 
- ```npm run phaseOne```
- ```npm run phaseTwo```
- ```npm run clean```




