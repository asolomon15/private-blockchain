const SHA256 = require('crypto-js/sha256');
const Boom = require('boom');
const hex2ascii = require('hex2ascii');


const Chain  = require('./simpleChain.js');
const Block  = require('./Block.js');
const MemPool = require('./MemPool.js');


class StarRegistryController {
  /**
  * Constructor of the StarRegistryController service.
  */
  constructor(server) {
    this.server = server;
    /* Blockchain Specfic methods */
    this.blockchain = new Chain.Blockchain();
    this.getBlockByIndex();
    this.postNewBlock();
    this.getBlockChain();
    this.getBlockByHash();

    /* MemPool Specific Methods */
    this.mempool = new MemPool.RequestMemPool();
    this.requestValidation();
    this.getAllValdaitionRequests();
    this.validate();
    this.addBlock();
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
          const block = await this.blockchain.getBlockByHeight(request.params.index);
          console.log(block);
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

  getBlockByHash() {
    this.server.route({
      method: 'GET',
      path: '/star/hash:{hash}',
      handler: async (request, h) => {
        console.log(request);
        try {
          const block = await this.blockchain.getBlockByHash(request.params.hash);
          console.log(block);
          return block;
        } catch (err) {
          return Boom.notFound("Hash #" + request.params.hash + " Not Found");
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


  /*
  addBlock()
      curl -X POST \
      http://localhost:8000/block \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache' \
      -d '{
            "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
          }'
  */
  addBlock() {
    this.server.route({
      method: 'POST',
      path: '/addblock',
      handler: async (request, h) => {
        const address = await request.payload.address;
        console.log(address);
        if(!this.mempool.verifyAddressRequest(address)) {
          return Boom.notFound("Address: " + address + "not found.");
        }
        const ra = request.payload.ra;
        const dec = request.payload.dec;
        const starStory = request.payload.story;
        const buf = Buffer.alloc(starStory.length, starStory).toString('hex');
        const body = {
          address: address,
          star: {
            ra: ra,
            dec: dec,
            //mag: MAG,
            //cen: CEN,
            story: buf
          }
        };
        //return body;
        let block = new Block.Block(body);
        console.log(block);
        return this.blockchain.addBlock(block);
        //return block;
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

  /**********  Mempool related code **********/

  /* addRequestValidation() send Request to validate
  curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
  }'
  */
  requestValidation() {
    this.server.route({
      method: 'POST',
      path: '/requestValidation',
      handler: async (request, h) => {
        if(request.payload.address !== '') {
          // Need to make sure that this is a valid addresses
          if(request.payload.address.length === 34 || request.payload.address.length === 33) {
            let memPoolEntry = this.mempool.addRequestValidation(request.payload.address);
            this.mempool.checkTimeoutRequests();
            return memPoolEntry;
          } else {
            return Boom.badRequest("Address " + request.payload.address + " is not valid");
          }
        }
      }
    });
  }

  /*  validate()
      curl -X GET \
      http://localhost:8000/requests \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache'
  */
  getAllValdaitionRequests() {
    this.server.route({
      method: 'GET',
      path: '/requests',
      handler: async (request, h) => {
        //return this.mempool.getRequestPoolEntries();
        //console.log(this.mempool.getRequestPoolEntries());
        return await this.mempool.getRequestPoolEntries();
      }
    });
  }

  /*
  curl -X POST \
    http://localhost:8000/message-signature/validate \
    -H 'Content-Type: application/json' \
    -H 'cache-control: no-cache' \
    -d '{
          "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
          "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
        }'
  */
  validate() {
    this.server.route({
      method: 'POST',
      path: '/message-signature/validate',
      handler: async (request, h) => {
        // Need to make sure that this is a valid addresses
        if(request.payload.address.length === 34 || request.payload.address.length === 33) {
          this.mempool.checkTimeoutRequests();
          const validMemPoolRequest = await this.mempool.validateRequestByWallet(request.payload.address, request.payload.signature);
          // need to lookup and verify that
          return validMemPoolRequest;
        }
        return Boom.badRequest("Address " + request.payload.address + " is not valid or signature is incorrect");
      }
    });
  }

}

//* export this object
module.exports = (server) => { return new StarRegistryController(server); }
