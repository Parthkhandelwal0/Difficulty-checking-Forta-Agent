import web3 from "web3";

export default class BlockDifficultyGetter {
    readonly web3: web3;
  
    constructor(web3: web3) {
      this.web3 = web3;
    }
  
     async getBlockDifficulty(blockNumber: number): Promise<number> {
      const block = await this.web3.eth.getBlock(blockNumber);
      const difficulty = block.difficulty;
      return difficulty;
    }
}