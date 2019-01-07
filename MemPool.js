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
  addEntry(memPoolEntry) {
    this.memPoolEntries[memPoolEntry.walletAddress] = memPoolEntry;
    this.timeoutRequests[memPoolEntry.walletAddress] = memPoolEntry.setTimeout();
  }

  // checkTimeoutRequests() Checks to see if the mempool entry gets removed based off of 300 seconds
  checkTimeoutRequests() {
    for(let walletAddress in this.memPoolEntries) {
      this.memPoolEntries[walletAddress].setTimeout(); // Lets run the time out again
      if (this.memPoolEntries[walletAddress].validationWindow <= 0 || this.memPoolEntries.length != 0) {
        console.log(this.memPoolEntries[walletAddress]);
        delete this.memPoolEntries[walletAddress];
        delete this.timeoutRequests[memPoolEntry.walletAddress];
      }
    }
  }

  // getRequestPoolEntries() is used for getting the full list of request entries
  getRequestPoolEntries() {
    let requestEntries = [];
    for(let walletAddress in this.memPoolEntries) {
      this.checkTimeoutRequests();
      requestEntries.push(this.memPoolEntries[walletAddress]);
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
  setTimeout() {
    const TimeoutRequestsWindowTime = 5*60*1000;
    let timeElapse = (new Date().getTime().toString().slice(0,-3)) - this.requestTimeStamp;
    let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
    this.validationWindow = timeLeft;
  }
}


// Modules to be exported.
module.exports.RequestMemPool = RequestMemPool;
module.exports.RequestMemPoolEntry = RequestMemPoolEntry;
//module.exports.RequestMemPool = RequestMemPool;
