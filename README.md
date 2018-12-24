# Simple Blockchain & REST API

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.   We also have a basic rest api which provides access to the private blockchain.

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
2. Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node app.js
```
3. Open your web browser and goto URL http://localhost:3000/block/all You will be able to view the Genesis block and any additional blocks that got created.
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
4. You can add a new block by posting data to this URL http://localhost:3000/block 
```
curl -X POST \
>   http://localhost:3000/block \
>   -H 'Cache-Control: no-cache' \
>   -H 'Content-Type: application/json' \
>   -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
>   -d '{
>     "data":"This is the second block"}'
{
  "hash":"dd149a5b1cd49bebf358581654d5a6e8faad80251ec7344ef1aeab9b2a8a5528",
  "height":1,
  "body":"This is the second block",
  "time":"1545625806",
  "previousBlockHash":"07b34623847acb49519add1614471aeb1c4eb44520215c9e7f8e54deba1627e9"
}
```
5. Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6. Validate blockchain
```
blockchain.validateChain();
```
7. Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8. Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```
