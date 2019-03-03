/* This is a simple script that contains the mempool entries. */


// Constents
const TimeoutRequestsWindowTime = 5*60*1000;
const bitcoinMessage = require('bitcoinjs-message');


/*
  RequestMemPool
    memPoolEntry
    TimeoutRequests
*/
class RequestMemPool {

  constructor() {
    this.memPoolEntries = [];
    this.timeoutRequests = [];
    this.validMemPoolEntries = [];
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
    if (Object.keys(this.memPoolEntries).length != 0) {
      for(let walletAddress in this.memPoolEntries) {
        console.log(walletAddress);
        console.log(this.memPoolEntries);
        await this.memPoolEntries[walletAddress].setTimeout(); // Lets run the time out again
        if (this.memPoolEntries[walletAddress].validationWindow <= 0 || this.memPoolEntries.length != 0) {
          //await console.log(this.memPoolEntries[walletAddress]);
          await delete this.memPoolEntries[walletAddress];
          await delete this.timeoutRequests[walletAddress];
        }
      }
    }
  }

  // getRequestPoolEntries() is used for getting the full list of request entries
  async getRequestPoolEntries() {
    let requestEntries = await [];
    if(Object.keys(this.memPoolEntries).length != 0)
    {
      for(let walletAddress in this.memPoolEntries) {
        await this.checkTimeoutRequests();
        await requestEntries.push(this.memPoolEntries[walletAddress]);
      }
    }
    return requestEntries;
  }

  async validateRequestByWallet(walletAddress, signature) {
    // Need to look up the wallet address.
    let validEntry = {};
    if (Object.keys(this.memPoolEntries).length != 0) {
      const requestEntry = await this.memPoolEntries[walletAddress];
      if (requestEntry.validationWindow >= 0) {
        let isValid = await bitcoinMessage.verify(requestEntry.message, requestEntry.walletAddress, signature);
        if(isValid) {
          const validEntry = {
            "registerStar": true,
            "status": {
              "address": requestEntry.walletAddress,
              "requestTimeStamp": requestEntry.requestTimeStamp,
              "message": requestEntry.message,
              "validationWindow": requestEntry.validationWindow,
              "messageSignature": isValid
            }
          };
          await delete this.memPoolEntries[validEntry.status.address];
          await delete this.timeoutRequests[validEntry.status.address];
          this.validMemPoolEntries[validEntry.status.address] = validEntry;
          console.log("THIS IS THE ENTRY")
          console.log(this.validMemPoolEntries)
          console.log("end of this")
          return validEntry;
        }
      }
    }
    return validEntry;
  }

  async getValidMemPoolEntries() {
    let validEntries = await [];
    if(Object.keys(this.validMemPoolEntries).length != 0) {
      for(let walletAddress in this.validMemPoolEntries) {
        await validEntries.push(this.validMemPoolEntries[walletAddress]);
      }
    }
    return validEntries;
  }

  // verifyAddressRequest(walletAddress) checks the validMemPoolEntries to see if is a valid entry.
  async verifyAddressRequest(walletAddress) {
    if (Object.keys(this.validMemPoolEntries) != 0) {
      const validEntry = await this.validMemPoolEntries[walletAddress];

      if (validEntry) {
        return true;
      }
      return false;
    }
  }
}

/*
  RequestMemPoolEntry is used for storing the requested entries.
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
