# Simple Blockchain & REST API

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.   We also have a basic rest api which provides access to the private blockchain.

## Motivation
The main goal of this project is to get an understanding of how create a simple blockchain.  From creating a basic block to chaining several blocks together. This has also been a learning experience javascript programming language.  As my current knowledge grows, so will this code base.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install hapijs with --save flag
```
npm install hapijs --save
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
4. Open your web browser and goto URL http://localhost:3000/block/all You will be able to view the Genesis block and any additional blocks that got created.
```
[
    {
        "hash": "07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9",
        "height": 0,
        "body": "First block in the chain - Genesis block",
        "time": "1545625606",
        "previousBlockHash": ""
    }
]
```
5. You can add a new block by using the curl command or using postman. the required is http://localhost:3000/block
```
curl -X POST \
   http://localhost:3000/block \
   -H 'Cache-Control: no-cache' \
   -H 'Content-Type: application/json' \
   -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
   -d '{
     "data":"This is the second block"}'
{
  "hash":"dd149a5b1cd49bebf358581654d5a6e8faad80251ec7344ef1aeab9b2a8a5528",
  "height":1,
  "body":"This is the second block",
  "time":"1545625806",
  "previousBlockHash":"07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9"
}
```
6. You can view the entire blockchain again by going to this URL http://localhost:3000/block/all
```
curl -X GET \
  http://localhost:3000/block/all \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json'
[
    {
        "hash": "07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9",
        "height": 0,
        "body": "First block in the chain - Genesis block",
        "time": "1545625606",
        "previousBlockHash": ""
    },
    {
        "hash": "dd149a5b1cd49bebf358581654d5a6e8faad80251ec7344ef1aeab9b2a8a5528",
        "height": 1,
        "body": "This is the second block",
        "time": "1545625806",
        "previousBlockHash": "07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9"
    }
]
```
7. You can also view individual blocks by using this URL http://localhost:3000/block/{index}. The index is the block height which is represented by an integer value.  
```
curl -X GET \
 http://localhost:3000/block/0 \
 -H 'Cache-Control: no-cache' \
 -H 'Content-Type: application/json'
 {
    "hash": "07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1545625606",
    "previousBlockHash": ""
}
```
