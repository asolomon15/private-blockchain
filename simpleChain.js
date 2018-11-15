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
		// Would like the Genisis height and currentheight to be attributes here.
  }

  // Add new block
  addBlock(newBlock){
		let self = this;
		self.getBlockHeight().then(function(height) {
			newBlock.time = new Date().getTime().toString().slice(0,-3); // Give the block a timestamp
			newBlock.hash = SHA256(JSON.stringify(newBlock)).toString(); // Add the block hash
			newBlock.height = height;	// We got the height of the block from getBlockHeight promise
			console.log("Block HEIGHT " + height);

			// Need to make sure that blocks are linked in a chain
			if (height > 0) {
				let previousHeight = height - 1;
				self.getBlock(previousHeight).then(function(previousBlock) {
					newBlock.previousBlockHash = previousBlock.hash;
				}).catch((err) => {console.log("Unable to get the previous block");});
			}
			// Lets add the block
			return self.model.addLevelDBData(height, JSON.stringify(newBlock).toString())
			.then(function(key, value) {
				console.log("Block ID ADDED " + key);
			});
		});
    // Adding block object to chain
  	this.chain.push(newBlock);
  }

	// Get block height promise
  getBlockHeight() {
		let self = this;
		return self.model.getLevelDBCount()
		.then(function(blockHeight) {
			return blockHeight;
		});
  }

	// get block
  getBlock(blockHeight) {
    // return object as a single string
		let self = this;
		return self.model.getLevelDBData(blockHeight)
		.then(function(blockData) {
			let block = JSON.parse(blockData);
			return block;
		});
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

bc = new Blockchain();
// console.log(bc.getBlockHeight());
