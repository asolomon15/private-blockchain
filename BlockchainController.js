const SHA256 = require('crypto-js/sha256');
const Chain  = require('./simpleChain.js');
const Block  = require('./Block.js');

const Boom = require('boom');

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
    this.server.route({
      method: 'GET',
      path: '/block/{index}',
      handler: async (request, h) => {
        try {
          let block = await this.blockchain.getBlock(request.params.index);
          //console.log(block);
          return block;
        } catch (err) {
          // Boom is a nice way to return http status codes as well as additional information.
          /* The boom return code is similar this json response below.
          return h.response.status(404).json({
            type: err.type || 'error',
            message: err.message
          });*/
          return Boom.notFound("Block #" + request.params.index + " Not Found");
        }
      }
    });
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
            //console.log(request);
            let newBlock = new Block.Block(request.payload.data);
            return this.blockchain.addBlock(newBlock);
          } else {
            return "New block contains no data";
          }
        } catch (err) {
          // Need to return a 403 forbidden
          // Since this is a simple block chain i can't see a reason why we can't create a new block but
          // for API consistancey we need to have a return value.
          return Boom.forbidden("Unable to create new a new block");
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
        return this.blockchain.getChain();  // Might need to return something here just to handle errors
      }
    });
  }
}


/**
 * Exporting the BlockchainController class
 * @param {*} server
 */
module.exports = (server) => { return new BlockchainController(server);}
