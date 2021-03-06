let Sysex = require('./SysexClass.js');

class LedsHandlerClass extends Sysex {

  sortPixel(pixelNum, cols, rows) {
    //return the true position of the pixel being sent in.
    //loop through all the odd rows
    for(let i = cols; i < cols*rows; i += 2*cols) {
      //if pixelNum has been passed, was in an even row, just return number
      if(pixelNum < i) {
        return pixelNum;
      }
      //is the current ODD row containing our pixelNum?
      if(pixelNum >= i && pixelNum < i + cols) {
        for(let j = i; j < Math.floor(cols/2) + i; j += 1) {
          let last = (i+cols)-(1+(j-i));
          let first = j;
          if (pixelNum === last) {
            return first;
          }
          else if (pixelNum === first) {
            return last;
          }
        }
      }
      //if not, go to next odd row
    }
    //when pixelNum exceeds last odd row
    return pixelNum;
  }

  sortArray(array1D, cols, rows) {
    //expected input is a 1D array
    //n inputs of type [R,G,B].

    //deep copy of array being returned, original untouched
    let newArray = array1D.slice();
    //flip every other row to account for physical ordering
    for(let i = cols; i < cols*rows; i += 2*cols) {
      for(let j = i; j < Math.floor(cols/2) + i; j += 1) {
        let last = newArray[(i+cols)-(1+(j-i))];
        let first = newArray[j];
        newArray[(i+cols)-(1+(j-i))] = first;
        newArray[j] = last;
      }
    }
    //array should now have every other row flipped
    return newArray;
  }

  setImage(colorsArray, cols, rows) {
    let colors = this.sortArray(colorsArray, cols, rows);
    if(colors <= 0) {
      return false;
    }
    else {
      let state = this;
      let availablePixels = true;
      let throttle = 0;

      //want to show() after every state.batch worth of commands
      //with a delay applied for subsequent batches
      while(availablePixels) {
        let i = throttle * state.properties.batch;
        if(i >= cols*rows) {
          availablePixels = false;
          continue;
        }
        setTimeout(function() {
          for(let j = i; j < i + state.properties.batch; j++) {
            //if exceeding the number of available pixels, break
            if(j >= cols*rows) {
              break;
            }
            state.setPixelColor(j, colors[j][0], colors[j][1], colors[j][2]);
          }
          state.show();
        }, throttle*state.properties.delay);
        throttle = throttle + 1;
      }
    } 
  }

}

module.exports = LedsHandlerClass;
