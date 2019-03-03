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
    this.getBlockChain();
    this.getBlockByHash();
    this.getBlockByWalletAddress();

    /* MemPool Specific Methods */
    this.mempool = new MemPool.RequestMemPool();
    this.requestValidation();
    this.getAllValdaitionRequests();
    this.getAllValidEntries();
    this.validate();
    this.addBlock();
  }

  /*
  getBlockByIndex() gets a specific block by the block height.
  if the height of the blockchain isn't valid this method returns a string notifying the user that the block doesn't exist.
  curl -X GET \
   http://localhost:8000/star/block/0 \
   -H 'Cache-Control: no-cache' \
   -H 'Content-Type: application/json'
   */
  getBlockByIndex() {
    this.server.route({
      method: 'GET',
      path: '/star/block/{index}',
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

  /*
  getBlockByHash() gets a specific block by the block's hash.
  curl -X GET \
    http://localhost:8000/star/block/hash:{hash}
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json'
  */
  getBlockByHash() {
    this.server.route({
      method: 'GET',
      path: '/star/block/hash:{hash}',
      handler: async (request, h) => {
        try {
          const block = await this.blockchain.getBlockByHash(request.params.hash);
          console.log(block);
          if (block === null) {
            return Boom.notFound("Hash #" + request.params.hash + " Not Found");
          }
          return block;
        } catch (err) {
          return Boom.notFound("Hash #" + request.params.hash + " Not Found");
        }
      }
    });
  }

  /*
  getBlockByHash() gets a specific block by the block's hash.
  curl -X GET \
    http://localhost:8000/star/address:{address}
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json'
  */
  getBlockByWalletAddress() {
    this.server.route({
      method: 'GET',
      path: '/star/address:{address}',
      handler: async (request, h) => {
        try {
          const blocks = await this.blockchain.getBlockByWalletAddress(request.params.address);
          console.log(blocks)
          if (blocks.length === 0) {
            return Boom.notFound("Wallet #"+ request.params.address + " NotFound");
          }
          return blocks;
        } catch (err) {
          return Boom.notFound("Wallet #"+ request.params.address + " NotFound");
        }
      }
    })
  }

  /*
  addBlock() Creates the star block and adds to the blockchain
      curl -X POST \
      http://localhost:8000/star/block/addblock \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache' \
      -d '{
            "address":"1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn"
            "ra":"79° 42 44.9"
            "dec":"12h 16m 1.0s"
            story:"Found star using https://skyview.gsfc.nasa.gov/current/cgi/query.pl"
          }'
  */
  addBlock() {
    this.server.route({
      method: 'POST',
      path: '/star/block/addblock',
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
        const block = new Block.Block(body);
        console.log(block);
        return this.blockchain.addBlock(block);
      }
    });
  }


  /* getBlockChain() is used to pull the entire chain and display.
     Realistically this shouldn't pull all blocks if the chain is massive.
  curl -X GET \
   http://localhost:8000/block/all \
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
  http://localhost:8000/star/tx/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
  }'
  */
  requestValidation() {
    this.server.route({
      method: 'POST',
      path: '/star/tx/requestValidation',
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

  /*  getAllValdaitionRequests() This will list all requests
      curl -X GET \
      http://localhost:8000/star/tx/allrequests \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache'
  */
  getAllValdaitionRequests() {
    this.server.route({
      method: 'GET',
      path: '/star/tx/allrequests',
      handler: async (request, h) => {
        //return this.mempool.getRequestPoolEntries();
        //console.log(this.mempool.getRequestPoolEntries());
        return await this.mempool.getRequestPoolEntries();
      }
    });
  }

  /*  getAllValdaitionRequests() This will list all requests
      curl -X GET \
      http://localhost:8000/star/tx/allvalid \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache'
  */
  getAllValidEntries() {
    this.server.route({
      method: 'GET',
      path: '/star/tx/allvalid',
      handler: async (request, h) => {
        //return this.mempool.getRequestPoolEntries();
        //console.log(this.mempool.getRequestPoolEntries());
        return await this.mempool.getValidMemPoolEntries();
      }
    });
  }

  /*
  curl -X POST \
    http://localhost:8000/star/tx/validate-message \
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
      path: '/star/tx/validate-message',
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
