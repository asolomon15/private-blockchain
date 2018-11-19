/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const Model  = require('./levelSandbox');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
		this.chain = new Model.Model();
		this.addBlock(new Block("First block in the chain - Genesis block"));
		// Would like the Genisis height and currentheight to be attributes here.
  }

  // Add new block
  addBlock(newBlock){
		let self = this;
		newBlock.time = new Date().getTime().toString().slice(0,-3); // Give the block a timestamp
		self.getBlockHeight().then(function(height) {
			if (height > 0) {
				newBlock.height = height;	// We got the height of the block from getBlockHeight promise
				let previousHeight = height - 1;
				return self.getBlock(previousHeight).then(function(previousBlock) {
					newBlock.previousBlockHash = previousBlock.hash;
					newBlock.hash = SHA256(JSON.stringify(newBlock)).toString(); // Add the block hash
					return self.chain.addLevelDBData(height, JSON.stringify(newBlock).toString()).then(function(key, value) {
						console.log("Block ID ADDED " + key);
					});
				}).catch((err) => {
					console.log("Unable to get the previous block");
				});
			} else {
				// Genesis block
				newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
				return self.chain.addLevelDBData(height, JSON.stringify(newBlock).toString()).then(function(key, value) {
					console.log("Adding the Genesis block");
				});
			}
		});
  }

	// Get block height promise
  getBlockHeight() {
		let self = this;
		return self.chain.getLevelDBCount()
		.then(function(blockHeight) {
			return blockHeight;
		});
  }

	// get block
  getBlock(blockHeight) {
    // return object as a single string
		let self = this;
		return self.chain.getLevelDBData(blockHeight)
		.then(function(blockData) {
			let block = JSON.parse(blockData);
			return block;
		});
  }

    // validate block
    validateBlock(blockHeight){
			let self = this;
      // get block object
			return self.getBlock(blockHeight).then(function(block) {
				let blockHash = block.hash;
				block.hash = '';
				// generate block hash
	      let validBlockHash = SHA256(JSON.stringify(block)).toString();
				if (blockHash === validBlockHash) {
					console.log('Block #'+blockHeight+' valid hash:\n'+blockHash+'<>'+validBlockHash)
					return true;
				} else {
					console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
					return false;
				}
			}).catch((err) => {console.log("Block not found " + err);});
    }

   // Validate blockchain
    validateChain() {
			let self = this;
			let blocksOfPromises = [];
			let errorLog = [];
			// Not sure how to use Promises.all
			// But we can still loop over the blocks
			self.getBlockHeight().then(function(height) {
				// Constructing an array of block promises
				for (var i = 0; i < height-1; i++) {
					blocksOfPromises.push(self.getBlock(i));
				}
				Promise.all(blocksOfPromises).then(function(blocks) {
					blocks.forEach(function(block) {
						self.validateBlock(block.height).then(function(isBlockValid) {
							if (isBlockValid === true) {
								console.log(block);
								// Need to make sure we don't compare the tip height with a height that isn't there
								if (block.height < blocks.length-1) {
									if (block.hash !== blocks[block.height+1].previousBlockHash) {
										errorLog.push(block.height);
									}
								}
							}
						}).catch((err) => {console.log("Unable to validate block " + err);});
					}).catch((err) => {console.log("Unable to iterate over blocks " + err);});
				}).catch((err) => {console.log("Unable to get the blocks from promises " + err);});
			}).catch((err) => {console.log("Unable to get the block height " + err);});
			if (errorLog.length>0) {
				console.log('Block errors = ' + errorLog.length);
				console.log('Blocks: #'+errorLog);
			} else {
				console.log('No errors detected');
			}
    }
}

/*bc = new Blockchain();

bc.getBlockHeight().then(function(count) {
	return bc.getBlock(count).then(function(block) {
		b = JSON.parse(JSON.stringify(block));
	});
});*/

//bc = new Blockchain();
//bc.addBlock(new Block("second block"));
//bc.addBlock(new Block("third block"));
//bc.addBlock(new Block("forth block"));
/*bc.validateBlock(1).then(function(trueOrFalse) {
	console.log(trueOrFalse);
});*/
// console.log(bc.getBlockHeight());
//  bc.validateChain();


const bc = new Blockchain();
(function theLoop (i) {
    setTimeout(function () {
			let blockTest = new Block("Test Block - " + (i + 1));
			bc.addBlock(blockTest)
			//.then((result) => {
			//	console.log(result);
        i++;
			//}).catch((err) => {console.log(err);});
			if (i < 100) theLoop(i);
		}, 100);
	})(0);
