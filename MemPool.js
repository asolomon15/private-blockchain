/* This is a simple script that contains the mempool entries. */


// Constents
const TimeoutRequestsWindowTime = 5*60*1000;


/*
  RequestMemPool
    memPoolEntry
    TimeoutRequests
*/
class RequestMemPool {

  constructor() {
    this.memPoolEntries = [];
    this.timeoutRequests = [];
  }

  // addEntry(memPoolEntry) is used for adding a MemPoolEntry
  async addRequestValidation(walletAddress) {
    let memPoolEntry = await new RequestMemPoolEntry(walletAddress);
    this.memPoolEntries[memPoolEntry.walletAddress] = await memPoolEntry;
    this.timeoutRequests[memPoolEntry.walletAddress] = await memPoolEntry.setTimeout();
    return memPoolEntry;
  }

  // checkTimeoutRequests() Checks to see if the mempool entry gets removed based off of 300 seconds
  async checkTimeoutRequests() {
    for(let walletAddress in this.memPoolEntries) {
      await this.memPoolEntries[walletAddress].setTimeout(); // Lets run the time out again
      if (this.memPoolEntries[walletAddress].validationWindow <= 0 || this.memPoolEntries.length != 0) {
        await console.log(this.memPoolEntries[walletAddress]);
        await delete this.memPoolEntries[walletAddress];
        await delete this.timeoutRequests[memPoolEntry.walletAddress];
      }
    }
  }

  // getRequestPoolEntries() is used for getting the full list of request entries
  async getRequestPoolEntries() {
    let requestEntries = await [];
    for(let walletAddress in this.memPoolEntries) {
      await this.checkTimeoutRequests();
      await requestEntries.push(this.memPoolEntries[walletAddress]);
    }
    return requestEntries;
  }

  validateRequestByWallet() {

  }
}

/*
  RequestMemPoolEntry
    walletAddress
    requestTimeStamp
    message
    validationWindow
*/
class RequestMemPoolEntry {

  constructor(walletAddress) {
    this.walletAddress = walletAddress;
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3);
    this.message = walletAddress + ":" + this.requestTimeStamp + ":starRegistry";
    this.validationWindow;
  }

  // setTimeout() is used for setting the time
  async setTimeout() {
    const TimeoutRequestsWindowTime = 5*60*1000;
    let timeElapse = await (new Date().getTime().toString().slice(0,-3)) - this.requestTimeStamp;
    let timeLeft = await (TimeoutRequestsWindowTime/1000) - timeElapse;
    this.validationWindow = await timeLeft;
  }
}


// Modules to be exported.
module.exports.RequestMemPool = RequestMemPool;
module.exports.RequestMemPoolEntry = RequestMemPoolEntry;
