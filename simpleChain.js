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

		class Blockchain {
		  constructor(){
				this.chain = new Model.Model();
				//this.addBlock(new Block("First block in the chain - Genesis block"));
				this.addGenesisBlock(new Block("First block in the chain - Genesis block"));
				// Would like the Genisis height and currentheight to be attributes here.
				this.currentHeight = 0; // Get the currentHight
		  }

			/* AddsGenesisBlock(newBlock) is used for initialization of the blockchain.
				It simply checks to see if a genesis block is persistantly stored. If there
				is no genesis block, this method will create it.
			*/
			async addGenesisBlock(newBlock) {
				try {
					let genesisBlock = await this.getBlock(0);  // Gets the block
					console.log("Genesis Block already exists");
					//console.log(genesisBlock);
				} catch (err) {
					console.log("Genesis Block doesn't exists ");
					newBlock.time = await new Date().getTime().toString().slice(0,-3);
					newBlock.hash = await SHA256(JSON.stringify(newBlock)).toString();
					let genesisHeight = await this.chain.addLevelDBData(0, JSON.stringify(newBlock).toString());
					console.log("Genesis block is now created ");
					console.log(newBlock);
				}
			}

		  // addBlock(newBlock)  adds a new block to the blockchain
		  async addBlock(newBlock) {
				newBlock.time = await new Date().getTime().toString().slice(0,-3); // Give the block a timestamp
				let height = await this.getBlockHeight();
				newBlock.height = height;
				let previousHeight = height - 1;
				try {
					let previousBlock = await this.getBlock(previousHeight);
					newBlock.previousBlockHash = previousBlock.hash;
					newBlock.hash = await SHA256(JSON.stringify(newBlock)).toString();
					let key = await this.chain.addLevelDBData(height, JSON.stringify(newBlock).toString());
					console.log("New block created at height: #" + key);
					this.currentHeight += height;
				} catch (err) {
					console.log("Unable to add block to blockchain " + err);
				}
		  }

			// Get block height promise
		  async getBlockHeight() {
				let numberOfBlocks = await this.chain.getLevelDBCount();
				return numberOfBlocks
		  }

			// get block
		  async getBlock(blockHeight) {
				let block = await this.chain.getLevelDBData(blockHeight);
				return block;
		  }

			// validate block
		  async validateBlock(blockHeight) {
		      // get block object
					try {
						let block = await this.getBlock(blockHeight);
						let blockHash = block.hash;
						block.hash = '';
						let validBlockHash = SHA256(JSON.stringify(block)).toString();
						if (blockHash === validBlockHash) {
							console.log('Block #'+blockHeight+' valid hash:\n'+blockHash+'<>'+validBlockHash);
							return true;
						} else {
							console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
							return false;
						}
					} catch(err) {
							console.log("Block not found " + err);
					}
		    }

		   // Validate blockchain
		   async validateChain() {
					let blocksOfPromises = [];
					let links = [];
					let errorLog = [];
					// Not sure how to use Promises.all
					// But we can still loop over the blocks
				  let height = await this.getBlockHeight()
					for (let i = 0; i < height; i++) {
						console.log("Height #" + i);
						try {
							let block = await this.getBlock(i);
							blocksOfPromises.push(block);
						} catch(err) {
							console.log(err);
						}
					}
					try {
						let chain = await Promise.all(blocksOfPromises);
						for (let i = 0; i < height; i++) {
							console.log(chain[i]);
							let validBlock = await this.validateBlock(chain[i].height);
							if (validBlock) {
								console.log("This is a valid block");
								if (chain[i].height < chain.length-1) {
									if (chain[i].hash !== chain[i+1].previousBlockHash) {
										errorLog.push(block.height);
									}
								}
							}
						}
						if (errorLog.length>0) {
							console.log('Block errors = ' + errorLog.length);
							console.log('Blocks: #'+errorLog);
						} else {
							console.log('No errors detected');
						}
					} catch(err) {
						console.log(err);
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
		//bc.validateChain();
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
