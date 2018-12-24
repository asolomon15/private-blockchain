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
  /*
  getBlockByIndex() gets a specific block by the block height.
  if the height of the blockchain isn't valid this method returns a string notifying the user that the block doesn't exist.
  curl -X GET \
   http://localhost:3000/block/0 \
   -H 'Cache-Control: no-cache' \
   -H 'Content-Type: application/json'
   */
  getBlockByIndex() {
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

  /*
  postNewBlock is used for creating a new block and adding this block to the blockchain
  curl -X POST \
    http://localhost:3000/block \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
    -d '{
      "data":"This is the second block"
  }'
  */
  postNewBlock() {
    this.server.route({
      method: 'POST',
      path: '/block',
      handler: (request, h) => {
        try {
          if(request.payload.data !== ''){
            console.log(request);
            let newBlock = new Block.Block(request.payload.data);
            return this.blockchain.addBlock(newBlock);
          } else {
            return "New block contains no data";
          }
        } catch (err) {
          return err;
        }
      }
    });
  }

  /* getBlockChain() is used to pull the entire chain and display
  curl -X GET \
   http://localhost:3000/block/all \
   -H 'Cache-Control: no-cache' \
   -H 'Content-Type: application/json'
   */
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
