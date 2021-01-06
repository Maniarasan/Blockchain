import { Blockchain } from "./blockchain";

const bitcoin = new Blockchain();

bitcoin.createNewBlock(21312, "safdsfsd1221", "123123fedsfs23v3");
bitcoin.createNewTransaction(100, "ALEXb78tgug8gy", "JENNYvyg78gg98yh98");

bitcoin.createNewBlock(21312, "jhghvjvhb778", "jhkhjh8y89709900");

bitcoin.createNewTransaction(50, "ALEXb78tgug8gy", "JENNYvyg78gg98yh98");
bitcoin.createNewTransaction(5000, "ALEXb78tgug8gy", "JENNYvyg78gg98yh98");
bitcoin.createNewTransaction(20, "ALEXb78tgug8gy", "JENNYvyg78gg98yh98");

const previousBlockHash = "78678676786HBHJBJBJJ";
const currentBlockData = [
  { amount: 10, sender: "97yyuigbi", recipient: "878hbujv78" },
  { amount: 100, sender: "87ygvuigbi", recipient: "878hbug78" },
  { amount: 30, sender: "87yyuigbi", recipient: "878hbug78" },
];
const nonce = 100;

console.log(bitcoin);

console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));
