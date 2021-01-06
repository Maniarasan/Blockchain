import { Blockchain } from "./blockchain";
import {v1 as uuidv4 } from 'uuid';
const express = require("express");
const app = express();
const bodyParser = require("body-parser");


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

app.listen("3000", () => {
  console.log("Listening on 3000");
});
