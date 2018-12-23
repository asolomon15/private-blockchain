const SHA256 = require('crypto-js/sha256');
const Chain  = require('./simpleChain.js');
const Block  = require('./Block.js');


class BlockchainController {

  /**
  * consturctor of the BlockchainController
  */
  constructor(server) {
    this.server = server;
    this.blockchain = new Chain.Blockchain();
    this.getBlockByIndex();
    this.postNewBlock();
    this.getBlockChain();
  }

  async getBlockByIndex() {
    try {
      this.server.route({
        method: 'GET',
        path: '/block/{index}',
        handler: (request, h) => {
          return this.blockchain.getBlock(request.params.index);
        }
      });
    }catch (err) {
      return "Unable to find block";
    }
  }

  //
  postNewBlock() {
    this.server.route({
      method: 'POST',
      path: '/block',
      handler: (request, h) => {
        try {
          let newBlock = new Block.Block(request.payload.data);
          return this.blockchain.addBlock(newBlock);
        } catch (err) {
          return err;
        }
      }
    });
  }

  // getBlockChain() is used to pull the entire chain and display
  getBlockChain() {
    this.server.route({
      method: 'GET',
      path: '/block/all',
      handler: (request, h) => {
        return this.blockchain.getChain();
      }
    });
  }
}



/**
 * Exporting the BlockchainController class
 * @param {*} server
 */
module.exports = (server) => { return new BlockchainController(server);}
