/**
* This API exposes the simplechain's functionlaity
*/

const Hapi = require('hapi');


class BlockchainAPI {

  /**
  * Constructor for this object
  */
  constructor() {
    this.server = Hapi.Server({
      port: 8000,
      host: 'localhost'
    });
    this.initControllers();
    this.start();
  }

  /**
  * Initialization of the controllers
  */
  initControllers() {
    require("./BlockchainController.js")(this.server);
    require("./MemPoolController.js")(this.server);
  }

  async start() {
    try {
      await this.server.start();
      console.log(`Server running at: ${this.server.info.uri}`);
    }
    catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
}


new BlockchainAPI();
