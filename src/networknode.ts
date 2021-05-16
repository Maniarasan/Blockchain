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
  const newTransaction = req.body;

  const blockIndex = mcoin.addTransactionToPendingTransactions(newTransaction);
  res.json(`Transaction will be added in block ${blockIndex}`);
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

app.post("/register-and-broadcast-node", (req: any, res: any) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (mcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    mcoin.networkNodes.push(newNodeUrl);
    console.log(newNodeUrl);
  }

  const regNodesPromises: any[] = [];
  mcoin.networkNodes.forEach((networkNodeUrl: any) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then((data: any) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...mcoin.networkNodes, mcoin.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then((data: any) => {
      res.json({ note: "New node registered " });
    })
    .catch((err: any) => {
      console.log(err);
    });
});

app.post("/register-node", (req: any, res: any) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = mcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = mcoin.currentNodeUrl !== newNodeUrl;
  console.log(nodeNotAlreadyPresent, notCurrentNode);
  if (nodeNotAlreadyPresent && notCurrentNode) {
    console.log("I am in");
    mcoin.networkNodes.push(newNodeUrl);
    res.json({ note: "New Node registered successfully" });
  } else if (!nodeNotAlreadyPresent) {
    res.json({ note: "Cannot register already existing node" });
  } else {
    res.json({ note: "Cannot register current node" });
  }
});

app.post("/register-nodes-bulk", (req: any, res: any) => {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach((networkNodeUrl: any) => {
    const nodeNotAlreadyPresent =
      mcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = mcoin.currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
      mcoin.networkNodes.push(networkNodeUrl);
    }

    res.json({ note: "Bulk registration successful" });
  });
});

app.use("/", (req: any, res: any) => {
  console.log(req);
  res.send("Enter a valid endpoint");
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.post("/transaction/broadcast", (req: any, res: any) => {
  const newTransaction = mcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  mcoin.addTransactionToPendingTransactions(newTransaction);
  const requestPromises: any = [];
  mcoin.networkNodes.forEach((networkNodeUrl: any) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transactions",
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully" });
  });
});
