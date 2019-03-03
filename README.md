# Private Blockchain Star Service

This is a star registry service that allows people to register and own their favorite celestial bodies.  Basically a user who has a bitcoin address can register a specific star and  it's data into a block. Eventually this block gets added to the blockchain.  I feel that this is one outstanding project that teaches the basics of how bitcoin works.

## Motivation
Learning the components that make up bitcoin is the primary motivation.

Features are below.
- Creating a request pool that holds user requests for 300s
- Creating a validation pool for holding valid transactions
- Adding star data to a block and adding that block to the blockchain.
- Creating a Star service API for interacting with the blockchain as well as the mempool.
- Adding additional DB data to add better blockchain search capabilities.

Even though this project is for learning key concepts of bitcoin/blockchain, it actually could be used for discovering new celestial bodies within the cosmos. Just imagine, a decentralized astronomy nodes sharing and validating new planets or stars.   An astronomy node could be connected to a telescope and use that telescope for verification of a new planet or possibly a comet.  Then share that data of the comet with other nodes and those nodes verifying that new planet/comet exists. 


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].
NOTE: This project doesn't have a UI so interacting with it requires using curl or Postman https://www.getpostman.com/

### Configuring your project

- Install the package dependencies from package.json
```
npm install
```

## Testing

To test code:  
1. Open a command prompt or shell terminal after install node.js.
2. Checkout the source code using git
```
git clone https://github.com/asolomon15/private-blockchain.git
```
3. You can start the application by typing the command below.
```
node app.js
```
4. http://localhost:8000/star/tx/requestValidation
```
[
    {
        "hash": "f7fa78b5ca8741f16a4c96db3012e9f34d9df8b05ce517d8eba8dbc70d0ca900",
        "height": 0,
        "body": {
            "star": {
                "ra": "22h 31m 14s",
                "dec": "-9° 17' 55.59",
                "story": "Genesis block starts with the solar system's star. THE SUN"
            }
        },
        "time": "1551498474",
        "previousBlockHash": ""
    }
]
```
5. http://localhost:8000/star/tx/allrequests Create a validation request  
```
curl -X POST \
 http://localhost:8000/requestValidation \
 -H 'Cache-Control: no-cache' \
 -H 'Content-Type: application/json' \
 -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
 -d '{
   "address":"1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ" }'
   {
       "walletAddress": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
       "requestTimeStamp": "1551502863",
       "message": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ:1551502863:starRegistry",
       "validationWindow": 300
   }
```
6. http://localhost:8000/star/tx/validate-message You can use this URL to view the request.
```
[
    {
        "walletAddress": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
        "requestTimeStamp": "1551502863",
        "message": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ:1551502863:starRegistry",
        "validationWindow": 268
    }
]
```
7. Using your electrum wallet, you can sign/verify the request message
```
IHPSWBtLTTJD+zIihSOJ0idIjOAgRO4rTf1huxQmtyIuB5Rej2ZUPE4xlVy0YZl9483HnDnIH6VqgP8TLss4s+Q=
```
8. http://localhost:8000/star/tx/allvalid You can view the validated request below.
```
{
    "registerStar": true,
    "status": {
        "address": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
        "requestTimeStamp": "1551502863",
        "message": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ:1551502863:starRegistry",
        "validationWindow": 268,
        "messageSignature": true
    }
}
```
9. add block http://localhost:8000/star/block/addblock
```
{
    "hash": "e179405f3c1e02bc8afcc9c791ff30dfb839a19784e59e21e22e2d95e5138a22",
    "height": 2,
    "body": {
        "address": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
        "star": {
            "ra": "\"68° 52' 56.9\"",
            "dec": "\"16h 29m 1.0s\"",
            "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c206a6f73657068696e6520626c616820",
            "storyDecoded": "Found star using https://skyview.gsfc.nasa.gov/current/cgi/query.pl josephine blah "
        }
    },
    "time": "1551503071",
    "previousBlockHash": "a88aac6aaac24279eb254309d0953e684a529dd09164860c0378258da1c3bafc"
}
```
10. Search the blockchain by height
```
{
    "hash": "455ef07bedd65b00eda86203b9497e5468d01324f555b498381a2ec0b87bfda4",
    "height": 3,
    "body": {
        "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
        "star": {
            "ra": "\"79° 42' 44.9\"",
            "dec": "\"12h 16m 1.0s\"",
            "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c"
        }
    },
    "time": "1551503408",
    "previousBlockHash": "e179405f3c1e02bc8afcc9c791ff30dfb839a19784e59e21e22e2d95e5138a22"
}
```
11. Search by block index http://localhost:8000/star/block/4
```
{
    "hash": "e179405f3c1e02bc8afcc9c791ff30dfb839a19784e59e21e22e2d95e5138a22",
    "height": 2,
    "body": {
        "address": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
        "star": {
            "ra": "\"68° 52' 56.9\"",
            "dec": "\"16h 29m 1.0s\"",
            "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c206a6f73657068696e6520626c616820"
        }
    },
    "time": "1551503071",
    "previousBlockHash": "a88aac6aaac24279eb254309d0953e684a529dd09164860c0378258da1c3bafc"
}
```
12. search block hash http://localhost:8000/star/block/hash:a09c356baa47da065f4ac35ed0ef37e11a9ce6db856713c2e9cdac60fbdbb693
```
{
    "hash": "a09c356baa47da065f4ac35ed0ef37e11a9ce6db856713c2e9cdac60fbdbb693",
    "height": 4,
    "body": {
        "address": "14LXr4cPYADoxN4Fy75Vvswe2CQbDeYvDq",
        "star": {
            "ra": "\"79° 42' 44.9\"",
            "dec": "\"12h 16m 1.0s\"",
            "story": "546869732069732061206e657720656e74727920776869636820726570726573656e74732061206e65772073746172"
        }
    },
    "time": "1551599871",
    "previousBlockHash": "455ef07bedd65b00eda86203b9497e5468d01324f555b498381a2ec0b87bfda4"
}
```
13. Search by wallet address http://localhost:8000/star/address:1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ
```
[
    {
        "hash": "a88aac6aaac24279eb254309d0953e684a529dd09164860c0378258da1c3bafc",
        "height": 1,
        "body": {
            "address": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
            "star": {
                "ra": "\"68° 52' 56.9\"",
                "dec": "\"16h 29m 1.0s\"",
                "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c206a6f73657068696e6520626c616820"
            }
        },
        "time": "1551502301",
        "previousBlockHash": "f7fa78b5ca8741f16a4c96db3012e9f34d9df8b05ce517d8eba8dbc70d0ca900"
    },
    {
        "hash": "e179405f3c1e02bc8afcc9c791ff30dfb839a19784e59e21e22e2d95e5138a22",
        "height": 2,
        "body": {
            "address": "1Ahm5mDFg1A1KyJJgYsLwfU8xkhpYS5JYJ",
            "star": {
                "ra": "\"68° 52' 56.9\"",
                "dec": "\"16h 29m 1.0s\"",
                "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c206a6f73657068696e6520626c616820"
            }
        },
        "time": "1551503071",
        "previousBlockHash": "a88aac6aaac24279eb254309d0953e684a529dd09164860c0378258da1c3bafc"
    }
]
```
