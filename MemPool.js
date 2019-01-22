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

  async validateRequestByWallet(walletAddress, signature) {
    // Need to look up the wallet address.
    const requestEntry = await this.memPoolEntries[walletAddress];
    if(requestEntry) {
      // Verify TimeoutRequestsWindowTime
      requestEntry.setTimeout();
      if (requestEntry.validationWindow >= 0) {
        let isValid = await bitcoinMessage.verify(requestEntry.message, requestEntry.walletAddress, signature);
        let validEntry = {
          "registerStar": true,
          "status": {
            "address": requestEntry.walletAddress,
            "requestTimeStamp": requestEntry.requestTimeStamp,
            "message": requestEntry.message,
            "validationWindow": requestEntry.validationWindow,
            "messageSignature": isValid
          }
        };
        await delete this.memPoolEntries[validEntry.address];
        await delete this.timeoutRequests[validEntry.address];
        this.validMemPoolEntries[validEntry.address] = validEntry;
        /*
        let validEntry = await new ValidMemPoolEntry(requestEntry.walletAddress);
        validEntry.requestTimeStamp = await requestEntry.requestTimeStamp;
        validEntry.message = await requestEntry.message;
        validEntry.validationWindow = await requestEntry.validationWindow;
        let isValid = await bitcoinMessage.verify(validEntry.message, validEntry.walletAddress, signature);
        validEntry.messageSignature = await isValid;
        await delete this.memPoolEntries[validEntry.walletAddress];
        await delete this.timeoutRequests[validEntry.walletAddress];
        this.validMemPoolEntries[validEntry.walletAddress] = validEntry;*/
        return validEntry;
      }
    } else {
      return this.validMemPoolEntries[walletAddress];
    }
  }

  async verifyAddressRequest(walletAddress) {
    const validEntry = await this.validMemPoolEntries[walletAddress];
    if (validEntry) {
      return true;
    } else {
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

class ValidMemPoolEntry {
  constructor(walletAddress) {
    this.registerStar = true;
    this.walletAddress = walletAddress;
    this.requestTimeStamp;
    this.message;
    this.validationWindow;
    this.messageSignature;
  }
}


// Modules to be exported.
module.exports.RequestMemPool = RequestMemPool;
module.exports.RequestMemPoolEntry = RequestMemPoolEntry;
