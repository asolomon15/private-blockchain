/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
//const db = level(chainDB);


class DBModel {
  constructor() {
    this.db = level(chainDB);
  }

  // Add data to levelDB with key/value pair
  addLevelDBData(key,value) {
    let self = this;
    return new Promise(function(resolve, reject) {
        self.db.put(key, value, function(err) {
        if (err) {
          console.log('Block ' + key + ' submission failed', err);
          reject(err);
        }
        resolve(key, value);
      });
    });
  }


  // Get data from levelDB with key
  getLevelDBData(key){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, function(err, value) {
        if (err) {
          console.log('Not found!', err);
          reject(err)
        }
        resolve(value)
      });
    });
  }

  // Add data to levelDB with value
  addDataToLevelDB(value) {
    let self = this;
    let i = 0;
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
          .on('data', function(data) {
            i++;
          })
          .on('error', function(err) {
            console.log('Unable to read data stream!', err)
            reject(err)
          })
          .on('close', function() {
            console.log('Block #' + i);
            self.addLevelDBData(i, value).then((key) => {
              console.log('Block #' + key);
            }).catch((err) => {
              console.log(err);
            });
            resolve(value);
          });
        });
  }

  // Get the count of all keys within the database
  getLevelDBCount() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let count = 0;
      self.db.createReadStream()
        .on('data', function(data) {
          count++
        })
        .on('error', function(err) {
          reject('Unable to get the data', err)
        })
        .on('close', function() {
          resolve(count)
        });
    });
  }
}


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/* ===== exporting these functions for the simplechain ========================|
|*/
module.exports.Model = DBModel;


/*const model = new DBModel();

(function theLoop (i) {
  setTimeout(function () {
    model.addDataToLevelDB("Testing data").then((key) => {
      console.log('key: ' + key);
    }).catch((err) => {console.log(err); });
    if (--i) theLoop(i);
  }, 100);
})(10);
*/
