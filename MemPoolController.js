const SHA256 = require('crypto-js/sha256');
const Boom = require('boom');
const Chain  = require('./simpleChain.js');
const Block  = require('./Block.js');
const MemPool = require('./MemPool.js');


class MemPoolController {

  // Constructor
  constructor(server) {
    this.server = server;
    this.mempool = new MemPool.RequestMemPool();
    this.requestValidation();
    this.getAllValdaitionRequests();
    this.validate();
    this.addBlock()
  }

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
          return validMemPoolRequest;
        }
        return Boom.badRequest("Address " + request.payload.address + " is not valid or signature is incorrect");
      }
    });
  }

  /*  addBlock()
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
        const address = request.payload.address;
        const ra = request.payload.ra;
        const dec = request.payload.dec;
        const starStory = request.payload.starStory;
        const buf = Buffer.alloc(32, starStory)
        const body = {
          address: request.payload.address,
          star: {
            ra: ra,
            dec: dec,
            //mag: MAG,
            //cen: CEN,
            story: buf.toString().hexEncode()
          }
        };
        return body;
        //let block = new Block.Block(body);
      }
    });
  }
}


//* export this object
module.exports = (server) => { return new MemPoolController(server);}
