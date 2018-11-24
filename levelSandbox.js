/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';

class DBModel {
	constructor() {
		this.db = level(chainDB);
	}

	// addLevelDBData() is used for adding a block at a particuclar height or index
	addLevelDBData(key, value) {
		let self = this;
		return new Promise(function (resolve, reject) {
			self.db.put(key, value, function (err) {
				if (err) {
					console.log('Block ' + key + ' submission failed', err);
					reject("Not Found");
				} else {
					resolve(key);
				}
			});
		});
	}

	// GetLevelDBData() Gets the leveldb data from the database
	getLevelDBData(key) {
		let self = this;
		return new Promise(function (resolve, reject) {
			self.db.get(key, function (err, value) {
				if (err) {
					//console.log('Not found!', err);
					reject(err);
				} else {
					resolve(JSON.parse(value));
				}
			});
		});
	}

	// addDataToLevelDB() adds a block by the specific value.
	addDataToLevelDB(value) {
		let self = this;
		let i = 0;
		return new Promise(function (resolve, reject) {
			self.db.createReadStream()
				.on('data', function (data) {
					i++;
				})
				.on('error', function (err) {
					console.log('Unable to read data stream!', err)
					reject(err)
				})
				.on('close', function () {
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

	// getLevelDBCount() Gets the number of entries in the db aka the height.
	getLevelDBCount() {
		let self = this;
		return new Promise(function (resolve, reject) {
			let count = 0;
			self.db.createReadStream()
				.on('data', function (data) {
					count++
				})
				.on('error', function (err) {
					reject(err)
				})
				.on('close', function () {
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
