# Star Service Blockchain

This is a star registry service that allows people to register and own their favorite celestial bodies.  Basically a user who has a bitcoin address can register a specific star and  it's data into a block. Eventually this block gets added to the blockchain.

## Motivation
Learning the components that make up bitcoin is the primary motivation.

Features are below.
- Creating a request pool that holds user requests for 300s
- Creating a validation pool for holding valid transactions
- Adding star data to a block and adding that block to the blockchain.
- Creating a Star service API for interacting with the blockchain as well as the mempool.
- Adding additional DB data to add better blockchain search capabilities.

Even though this project is for learning key concepts of bitcoin/blockchain, it actually could be used for discovering new celestial bodies within the cosmos. Just imagine, a decentralized astronomy nodes sharing and validating new planets or stars.   An astronomy node could be connected to a telescope and use that telescope for verification of a new celestial body.  Then share that data of the comet with other nodes and those nodes verifying that new planet/comet exists.


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

Below contains the steps for adding star data to this blockchain.  Keep in mind that I don't have a GUI for this.  You will need to use curl  
1. Open a command prompt or shell terminal after you install node.js.
2. Checkout the source code using git
```
git clone https://github.com/asolomon15/private-blockchain.git
```
3. You can start the application by typing the command below.
```
node app.js
```
4. Create a validation request http://localhost:8000/star/tx/requestValidation
```
curl  -X POST http://localhost:8000/star/tx/requestValidation
      -H 'Content-Type: application/json' -d '{
        "address":"1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8"
        }'
{
  "message": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8:1551665182:starRegistry",
  "requestTimeStamp": "1551665182",
  "validationWindow": 300,
  "walletAddress": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8"
}
```
5. View the pool of validation requests http://localhost:8000/star/tx/allrequests
```
curl -X GET http://localhost:8000/star/tx/allrequests \
      -H 'Content-Type: application/json' \
      -H 'cache-control: no-cache' | python -mjson.tool
[
    {
        "message": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8:1551665565:starRegistry",
        "requestTimeStamp": "1551665565",
        "validationWindow": 274,
        "walletAddress": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8"
    },
    {
        "message": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn:1551665561:starRegistry",
        "requestTimeStamp": "1551665561",
        "validationWindow": 270,
        "walletAddress": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn"
    }
]
```
6. Using your electrum wallet to sign the request message
```
IIIqiKCl7j3ewxyP2pxqHUHJencbv2zVJjNZkXBlfXG+IE9nrjB30CWqB9yWjlaDhxWj9f0f2fk3liodQkMaKTc=
```
7. Here you can verify that the message was signed. http://localhost:8000/star/tx/validate-message
```
curl -X POST \
     http://localhost:8000/star/tx/validate-message \
     -H 'Content-Type: application/json' \
     -H 'cache-control: no-cache' \
     -d '{
           "address":"1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8",
           "signature":"IIIqiKCl7j3ewxyP2pxqHUHJencbv2zVJjNZkXBlfXG+IE9nrjB30CWqB9yWjlaDhxWj9f0f2fk3liodQkMaKTc="
         }' | python -mjson.tool
{
    "registerStar": true,
    "status": {
        "address": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8",
        "message": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8:1551665869:starRegistry",
        "messageSignature": true,
        "requestTimeStamp": "1551665869",
        "validationWindow": 207
    }
}
```
8. Here you can view all valid messages that have been signed.  http://localhost:8000/star/tx/allvalid
```
curl -X GET http://localhost:8000/star/tx/allvalid -H 'Content-Type: application/json' -H 'cache-control: no-cache' | python -mjson.tool
[
    {
        "registerStar": true,
        "status": {
            "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
            "message": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn:1551665865:starRegistry",
            "messageSignature": true,
            "requestTimeStamp": "1551665865",
            "validationWindow": 296
        }
    },
    {
        "registerStar": true,
        "status": {
            "address": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8",
            "message": "1BK5SM1C8aSBVvWx3CRWdKR6MwHoTkfAy8:1551665869:starRegistry",
            "messageSignature": true,
            "requestTimeStamp": "1551665869",
            "validationWindow": 207
        }
    }
]
```
9. Here is where you can add your Star information and that information can get added to a block http://localhost:8000/star/block/addblock
```
curl -X POST http://localhost:8000/star/block/addblock \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
      "address":"1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
      "ra":"00 h42 m44.3 s",
        "dec":"°16′9″",
        story:"The Andromeda Galaxy, also known as Messier 31, M31, or NGC 224, is a spiral galaxy approximately 780 kiloparsecs from Earth, and the nearest major galaxy to the Milky Way. Its name stems from the area of the sky in which it appears, the constellation of Andromeda. https://en.wikipedia.org/wiki/Andromeda_Galaxy"
    }' | python -mjson.tool
{
    "hash": "c71fe9711107237909f5fa8cb416b4975464993f87243b96b1a45c2fa44c01fa",
    "height": 7,
    "body": {
        "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
        "star": {
            "ra": "\"00 h42 m44.3 s\"",
            "dec": "\"°16′9″\"",
            "story": "54686520416e64726f6d6564612047616c6178792c20616c736f206b6e6f776e206173204d6573736965722033312c204d33312c206f72204e4743203232342c20697320612073706972616c2067616c61787920617070726f78696d6174656c7920373830206b696c6f706172736563732066726f6d2045617274682c20616e6420746865206e656172657374206d616a6f722067616c61787920746f20746865204d696c6b79205761792e20497473206e616d65207374656d732066726f6d207468652061726561206f662074686520736b7920696e20776869636820697420617070656172732c2074686520636f6e7374656c6c6174696f6e206f6620416e64726f6d6564612e2068747470733a2f2f656e2e77696b6970656469612e6f72672f77696b692f416e64726f6d6564615f47616c617879",
            "storyDecoded": "The Andromeda Galaxy, also known as Messier 31, M31, or NGC 224, is a spiral galaxy approximately 780 kiloparsecs from Earth, and the nearest major galaxy to the Milky Way. Its name stems from the area of the sky in which it appears, the constellation of Andromeda. https://en.wikipedia.org/wiki/Andromeda_Galaxy"
          }
        },
        "time": "1551667075",
        "previousBlockHash": "d05746c3ad261fa33e116d3d29ee56ab8b8bee5af9c5b812ef3c2dba43189f88"
  }
```
10. Search the blockchain by the height http://localhost:8000/star/block/[block-height].  The height is actually the index starting at Genesis block 0.
```
curl -X GET http://localhost:8000/star/block/7 -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' | python -mjson.tool
{
    "body": {
        "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
        "star": {
            "dec": "\"\u00b016\u20329\u2033\"",
            "ra": "\"00 h42 m44.3 s\"",
            "story": "54686520416e64726f6d6564612047616c6178792c20616c736f206b6e6f776e206173204d6573736965722033312c204d33312c206f72204e4743203232342c20697320612073706972616c2067616c61787920617070726f78696d6174656c7920373830206b696c6f706172736563732066726f6d2045617274682c20616e6420746865206e656172657374206d616a6f722067616c61787920746f20746865204d696c6b79205761792e20497473206e616d65207374656d732066726f6d207468652061726561206f662074686520736b7920696e20776869636820697420617070656172732c2074686520636f6e7374656c6c6174696f6e206f6620416e64726f6d6564612e2068747470733a2f2f656e2e77696b6970656469612e6f72672f77696b692f416e64726f6d6564615f47616c617879"
        }
    },
    "hash": "c71fe9711107237909f5fa8cb416b4975464993f87243b96b1a45c2fa44c01fa",
    "height": 7,
    "previousBlockHash": "d05746c3ad261fa33e116d3d29ee56ab8b8bee5af9c5b812ef3c2dba43189f88",
    "time": "1551667075"
}
```
11. search block hash http://localhost:8000/star/block/hash:[hash]  where the hash is the hash of a block.
```
curl -X GET http://localhost:8000/star/block/hash:c71fe9711107237909f5fa8cb416b4975464993f87243b96b1a45c2fa44c01fa -H 'Cache-Control: no-cache' -H 'Content-Type: application/json'  | python -mjson.tool
{
    "body": {
        "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
        "star": {
            "dec": "\"\u00b016\u20329\u2033\"",
            "ra": "\"00 h42 m44.3 s\"",
            "story": "54686520416e64726f6d6564612047616c6178792c20616c736f206b6e6f776e206173204d6573736965722033312c204d33312c206f72204e4743203232342c20697320612073706972616c2067616c61787920617070726f78696d6174656c7920373830206b696c6f706172736563732066726f6d2045617274682c20616e6420746865206e656172657374206d616a6f722067616c61787920746f20746865204d696c6b79205761792e20497473206e616d65207374656d732066726f6d207468652061726561206f662074686520736b7920696e20776869636820697420617070656172732c2074686520636f6e7374656c6c6174696f6e206f6620416e64726f6d6564612e2068747470733a2f2f656e2e77696b6970656469612e6f72672f77696b692f416e64726f6d6564615f47616c617879"
        }
    },
    "hash": "c71fe9711107237909f5fa8cb416b4975464993f87243b96b1a45c2fa44c01fa",
    "height": 7,
    "previousBlockHash": "d05746c3ad261fa33e116d3d29ee56ab8b8bee5af9c5b812ef3c2dba43189f88",
    "time": "1551667075"
}
```
12. Search by wallet address http://localhost:8000/star/address:[WALLET_ADDRESS]. Simply use a wallet address previously added. 
```
curl -X GET  http://localhost:8000/star/address:1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn  -H 'Cache-Control: no-cache' -H 'Content-\
    {
        "body": {
            "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
            "star": {
                "dec": "\"12h 16m 1.0s\"",
                "ra": "\"79\u00b0 42' 44.9\"",
                "story": "466f756e642073746172207573696e672068747470733a2f2f736b79766965772e677366632e6e6173612e676f762f63757272656e742f6367692f71756572792e706c"
            }
        },
        "hash": "455ef07bedd65b00eda86203b9497e5468d01324f555b498381a2ec0b87bfda4",
        "height": 3,
        "previousBlockHash": "e179405f3c1e02bc8afcc9c791ff30dfb839a19784e59e21e22e2d95e5138a22",
        "time": "1551503408"
    },
    {
        "body": {
            "address": "1KP9EfYZnmGtFbYrELX7PpgKSGBMqbnsn",
            "star": {
                "dec": "\"\u00b016\u20329\u2033\"",
                "ra": "\"00 h42 m44.3 s\"",
                "story": "54686520416e64726f6d6564612047616c6178792c20616c736f206b6e6f776e206173204d6573736965722033312c204d33312c206f72204e4743203232342c20697320612073706972616c2067616c61787920617070726f78696d6174656c7920373830206b696c6f706172736563732066726f6d2045617274682c20616e6420746865206e656172657374206d616a6f722067616c61787920746f20746865204d696c6b79205761792e20497473206e616d65207374656d732066726f6d207468652061726561206f662074686520736b7920696e20776869636820697420617070656172732c2074686520636f6e7374656c6c6174696f6e206f6620416e64726f6d6564612e2068747470733a2f2f656e2e77696b6970656469612e6f72672f77696b692f416e64726f6d6564615f47616c617879"
            }
        },
        "hash": "c71fe9711107237909f5fa8cb416b4975464993f87243b96b1a45c2fa44c01fa",
        "height": 7,
        "previousBlockHash": "d05746c3ad261fa33e116d3d29ee56ab8b8bee5af9c5b812ef3c2dba43189f88",
        "time": "1551667075"
    }
]
```
13. You can also query the entire blockchain with this url http://localhost:8000/block/all
```
curl -X GET http://localhost:8000/block/all  -H 'Cache-Control: no-cache' -H 'Content-Type: application/json' | python -mjson.tool
[
    {
        "body": {
            "star": {
                "dec": "-9\u00b0 17' 55.59",
                "ra": "22h 31m 14s",
                "story": "Genesis block starts with the solar system's star. THE SUN"
            }
        },
        "hash": "f7fa78b5ca8741f16a4c96db3012e9f34d9df8b05ce517d8eba8dbc70d0ca900",
        "height": 0,
        "previousBlockHash": "",
        "time": "1551498474"
    }
]
```
