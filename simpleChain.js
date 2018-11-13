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
    this.chain = [];
		this.model = new Model.Model();
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
		let self = this;
		self.getBlockHeight().then(function(height) {
			// UTC timestamp
			newBlock.time = new Date().getTime().toString().slice(0,-3);
			// Block hash with SHA256 using newBlock and converting to a string
			newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
			console.log("What is the height " + height);

			// Need to make sure we get the genesis block first.
			if (height === 0) {
				// Block height
				newBlock.height = height;
				// Handle the genesis block
				self.addSingleBlock(height, newBlock).then(function(height) {
					console.log("Genesis Block " + height);
					return self.getBlock(0).then(function(genesisBlock){
						console.log(genesisBlock);
					});
				});
			} else {
				// Need to handle all other blocks
				let previousHeight = height - 1;  // Getting the previous hash
				newBlock.height = height; // Assign the block height
				return self.getBlock(previousHeight).then(function(block) {
					let blockObj = JSON.parse(block);						// Convert the block string into obj
					newBlock.previousBlockHash = blockObj.hash; // assign the previous hash
					// Block height
					return self.addSingleBlock(height, newBlock).then(function(height) {
						return self.getBlock(height).then(function(theBlock) {
							console.log(theBlock);
						});
					});
				}).catch((err) => {console.log('Unable to add block ' + err);});
			}
		});
    // Adding block object to chain
  	this.chain.push(newBlock);
  }

	addSingleBlock(height, genesisBlock) {
		let self = this;
		let blockPromise = self.model.addLevelDBData(height, JSON.stringify(genesisBlock).toString());
		//let blockPromise = self.model.addLevelDBData(height, genesisBlock);
		return blockPromise;
	}

	// Get block height promise
  getBlockHeight() {
		let self = this;
		let heightPromise = self.model.getLevelDBCount();
		return heightPromise;
  }

	// get block
  getBlock(blockHeight) {
    // return object as a single string
		let self = this;
		let blockPromise = self.model.getLevelDBData(blockHeight);
		return blockPromise;
		// Make sure to parse into json
    //return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
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

// bc = new Blockchain();
// console.log(bc.getBlockHeight());
