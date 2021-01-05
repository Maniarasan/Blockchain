export class Blockchain {
  chain: any = [];
  pendingTransactions: any = [];

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
  }

  createNewBlock(nonce: any, previousBlockHash: any, hash: any) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
  }

  getLastBlock()
  {
    return this.chain[this.chain.length-1]

  }

  createNewTransaction(amount:any, sender:any, recipient:any){
const newTransaction = {
  amount:amount,
  sender:sender,
  recipient:recipient
}
this.pendingTransactions.push(newTransaction);

return this.getLastBlock()['index']+1;

  }


}
