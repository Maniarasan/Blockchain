export class Blockchain {
  chain: any = [];
  newTransactions: any = [];

  constructor() {
    this.chain = [];
    this.newTransactions = [];
  }

  createNewBlock(nonce: any, previousBlockHash: any, hash: any) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.newTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
  }
}
