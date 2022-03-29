import BlockDifficultyGetter from "./difficultyGetter";
import ethers from "ethers";
import web3 from "web3"

describe("BlockDifficultyGetter tests", () => {
  const mockGetBlockFn = jest.fn((blockNumber) => {
    const blocksByNumber: { [key: number]: any } = {
      1: {
        difficulty: 10
      },
      2: {
        difficulty: 20
      }
    };
    return blocksByNumber[blockNumber];
  });

  const mockWeb3: any = {
    eth:{
      getBlock: mockGetBlockFn
    }

  };

  it("should return correct difficulty per block", async () => {
    const getter: BlockDifficultyGetter = new BlockDifficultyGetter(
        mockWeb3 as web3
    );
    expect(await getter.getBlockDifficulty(1)).toStrictEqual(10);
    expect(await getter.getBlockDifficulty(2)).toStrictEqual(20);
  });
});