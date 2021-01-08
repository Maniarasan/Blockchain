import { Blockchain } from "./blockchain";
import { v1 as uuidv4 } from "uuid";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.argv[2];
const currentNodeUrl = process.argv[3];
const rp = require("request-promise");

const nodeAddress = uuidv4().split("-").join("");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mcoin = new Blockchain();

app.get("/blockchain", (req: any, res: any) => {
  res.send(mcoin);
});

app.post("/transaction", (req: any, res: any) => {
  const blockIndex = mcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.get("/mine", (req: any, res: any) => {
  const lastBlock = mcoin.getLastBlock();
  const previousBlockhash = lastBlock["hash"];
  const currentBlockData = {
    transactions: mcoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };
  const nonce = mcoin.proofOfWork(previousBlockhash, currentBlockData);
  const blockhash = mcoin.hashBlock(previousBlockhash, currentBlockData, nonce);
  mcoin.createNewTransaction(12.5, "00", nodeAddress);
  const newBlock = mcoin.createNewBlock(nonce, previousBlockhash, blockhash);

  res.json({ note: "New Block mined successfully", block: newBlock });
});

app.use("/", (req: any, res: any) => {
  res.send("Enter a valid endpoint");
});

app.post("register-and-broadcast-node", (req: any, res: any) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (mcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    mcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises: any[] = [];
  mcoin.networkNodes.forEach((networkNodeUrl: any) => {
    const requestOptions = {
      uri: networkNodeUrl + "register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    regNodesPromises.push(rp(requestOptions));
  });


  Promise.all(regNodesPromises)
  .then((data: any) => {
    const bulkRegisterOptions = {
      uri: newNodeUrl + "register-nodes-bulk",
      method: "POST",
      body: {
        allNetworkNodes: [...mcoin.networkNodes, mcoin.currentNodeUrl],
      },
      json: true,
    };

    return rp(bulkRegisterOptions);
  })
  .then((data: any) => {
    res.json({note: 'New node registered '})
  });

});

app.post("register-node", (req: any, res: any) => {});

app.post("register-nodes-bulk", (req: any, res: any) => {});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
