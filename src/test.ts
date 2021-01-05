import {Blockchain} from './blockchain'

const bitcoin = new Blockchain();

bitcoin.createNewBlock(21312,'safdsfsd1221','123123fedsfs23v3');
bitcoin.createNewTransaction(100, "ALEXb78tgug8gy","JENNYvyg78gg98yh98")

bitcoin.createNewBlock(21312,'jhghvjvhb778','jhkhjh8y89709900');

bitcoin.createNewTransaction(50, "ALEXb78tgug8gy","JENNYvyg78gg98yh98")
bitcoin.createNewTransaction(5000, "ALEXb78tgug8gy","JENNYvyg78gg98yh98")
bitcoin.createNewTransaction(20, "ALEXb78tgug8gy","JENNYvyg78gg98yh98")


console.log(bitcoin);

console.log(bitcoin.hashBlock());