/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/


const hex2ascii = require('hex2ascii');

class Block {
	constructor(data) {
		this.hash = "",
		this.height = 0,
		this.body = data,
		this.time = 0,
		this.previousBlockHash = ""
	}

	storyDecode() {
		return hex2ascii(this.body["star"]["story"])
	}
}

module.exports.Block = Block;
