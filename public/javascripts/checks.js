function checkForAWin(positionArray, yellow){
    /**
     * checks an array of positions to see if it is a winning position
     * @param {Array} positionArray - the array to search
     * @param {boolean} yellow - true will check if it's winning for yellow, false checks if winning for black
     * keep in mind, yellow => winning vertically, black => winning horizontally
     */

    //gotta love ADS! here's the edge case:
    if(positionArray.length == 0){
        return false;
    }

    let xy = 0;         //should we check x or y coordinates of an [x,y] pair?
                        //0 cooresponds to black, 1 for y
    if(yellow){         //if we're checking for a yellow win, we want
        xy = 1;       //to check for the y-coordinate, which is at 
    }                   //index 1 in the [x,y] style, so xy is set to 1
    
    for (let i = 0; i < positionArray.length; i++) {        //loop over the array of positions
        let checkMe = positionArray[i];
        //first, we check that what we're looking at is actually an array of positions:

        if(Array.isArray(checkMe[0])){
            //this will be true if the 0th value of checkMe is an array,
            //which means that checkMe is an array of arrays and not an [x,y] position
            //if it is, we check that the length is at least 11
            //(you cannot win with an array of 10 or less)

            if(checkMe.length > 10){
                let min = false;    //does the min position occur in this array of connected points?
                let max = false;    //does the max? these are checked in the following block

                for(let j = 0; j < checkMe.length; j++){
                    //loop over checkMe, which we have established is an array of at
                    //least 11 positions
                    
                    for(let i = 0; i < checkMe.length; i++){
                        if(checkMe[i][xy] == 11){       //if true, then we found max value in this array
                            max = true; 
                        }
                        if(checkMe[i][xy] == 1){        //if true, we found min value in this array
                            min = true;
                        }
                    }
                    
                    return (max && min);       //if we found both 1 and 11 in a set of connected points,
                                               //searching in the proper direction (y for yellow, x for black)
                                               //then we found a winning array
                }
            }
        }
    }
}

function checkAllNodesForConnection(positionArray){
    /**
     * this function checks an entire array of positions for connections between 
     * the positions in positionArray
     * if we find a connection, we run this again
     */

     for(let i = 0; i < positionArray.length - 1; i++){
         for(let j = i + 1; j < positionArray.length; j++){

             if(checkForConnectedNodes(i, j, positionArray)){
                 checkAllNodesForConnection(positionArray);
             }
         }
     }
}

function checkForConnectedNodes(position1, position2, positionArray){
   /**
    * @param {int} position1 - first position to check (may be array of positions)
    * @param {int} position2 - second position to check (may be array of positions)
    * @param {Array} positionArray - is it the yellow or black positions? this is the array that position1 and position2 are in
    * 
    * time to explain the arrays. so, we have the arrays yellows and blacks,
    * these contain all the positions for yellow and black. when we check for
    * connected nodes, if we do indeed find nodes that are connected, we just make 
    * an array of the positions and put that in yellows/blacks. so, we need to check in the 
    * beginning of this function whether either of the arrays at position1 or position2 is
    * an array of arrays, or just an array of [xposition, yposition]. this is done by checking
    * if the first element is an array, and if it is, then we treat it as an array of positions.
    * 
    * if either one is an array, we need to check each of it's positions for 
    * connectedness to position2. if both are arrays, we check every single combination of
    * positions for connectedness. if neither is an array, and they are connected,
    * we make a new array of the two positions, push that to the positionArray, 
    * and remove the original individual positions from positionArray.
    * 
    * in short, this function updates positionArray based on whether or not there are 
    * connected nodes that aren't yet part of the same array in positionArray. if this
    * is the case, the arrays are joined together, put in positionArray, and then 
    * position1 and position2 are removed from the array.
    */

    if(position1 == position2){
        return false;
    }

    let array1 = positionArray[position1];
    let array2 = positionArray[position2];

    if(Array.isArray(array1[0])){        //checks if the first element of array1 is Array
        if(Array.isArray(array2[0])){    //checks if second is also Array
            console.log("Case 1:");
            console.log("Array 1: " + array1);
            console.log("Array 2: " + array2); 
            //CASE ONE:
            //to get here, both array1 and array2 are arrays of positions.
            //we search for a connection, if one is found, we merge the arrays.
            for(let i = 0; i < array1.length; i++){
                for(let j = 0; j < array2.length; j++){
                    if(areTwoNodesConnected(array1[i], array2[j])){ //checks if arrays are connected
                        let mergedArrays = array1.concat(array2);

                        positionArray.splice(position1, 1);

                        //position1 has been taken out of the array, that means that
                        //if position2 was after position1, then we need to offset position2 by one
                        //to still have position2 be the index of array2
                        if(position1 < position2){
                            position2--;
                        }
                        positionArray.splice(position2, 1);
                             //removes the arrays from the array of positions
                        
                        positionArray.push(mergedArrays);       //add them back as a single array
                        return true;
                    }
                }
            }
        }
        else{
            console.log("Case 2:");
            console.log("Array 1: " + array1);
            console.log("Array 2: " + array2); 
            //CASE 2:
            //to get here, array1 is an array of positions, and array2 is just one position
            for(let i = 0; i < array1.length; i++){
                if(areTwoNodesConnected(array1[i], array2)){
                    array1.push(array2);
                    positionArray.splice(position1, 1);
                    //same deal as before, we offset position2 if need be
                    if(position1 < position2){
                        position2--;
                    }
                    positionArray.splice(position2, 1);

                    positionArray.push(array1);
                    return true;
                }
            }
        }

    }
    else{
        if(Array.isArray(array2[0])){
            console.log("Case 3:");
            console.log("Array 1: " + array1);
            console.log("Array 2: " + array2); 
            //CASE 3:
            //to get here, array1 is a position and array2 is an array of positions
            for(let i = 0; i < array2.length; i++){
                if(areTwoNodesConnected(array2[i], array1)){
                    array2.push(array1);
                    positionArray.splice(position1, 1);
                    //same deal as before, we offset position2 if need be
                    if(position1 < position2){
                        position2--;
                    }
                    
                    positionArray.splice(position2, 1);
                    positionArray.push(array2);
                    return true;
                }
            }
        }
        else{
            console.log("Case 4:");
            console.log("Array 1: " + array1);
            console.log("Array 2: " + array2); 
            //CASE 4:
            //to get here, both array1 and array2 are just single positions
            if(areTwoNodesConnected(array1, array2)){
                let mergedArrays = new Array();

                mergedArrays.push(array1);
                mergedArrays.push(array2);

                positionArray.splice(position1, 1);
                //same deal as before, we offset position2 if need be
                if(position1 < position2){
                    position2--;
                }

                positionArray.splice(position2, 1);

                positionArray.push(mergedArrays);
                return true;
            }
        }
    }
    return false;
}

function areTwoNodesConnected(position1, position2){
    //this function will only be called with actual positions on the grid
    let xDistance = position1[0] - position2[0];
    let yDistance = position1[1] - position2[1];

    if(Math.abs(xDistance) < 2){ 
        if(Math.abs(yDistance) < 2){  
            if(xDistance == yDistance){
            /*when xDistance == yDistance, that means the difference in their
            positions is either +1 in the x and +1 in the y, or -1 in the x and 
             -1 in the y. (or 0 and 0, but this will not happen) these hexagons are not connected, you can see for yourself
            in the browser console when you click on hexagons and check their positions*/
                return false;
            }
            else{
                return true;
            }
        }
    }
    return false;
}