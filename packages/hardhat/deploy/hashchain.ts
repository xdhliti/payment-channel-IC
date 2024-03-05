import { keccak256 } from "ethers";

const HashChain = ["secret"];

for (let i = 0; i < 100; i++) {
  HashChain.push(keccak256(HashChain[i]));
}
const hash_tip = HashChain[0];

export default hash_tip;
