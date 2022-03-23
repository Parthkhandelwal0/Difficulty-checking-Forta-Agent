import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
} from "forta-agent";

import BlockDifficultyGetter from "./difficultyGetter";


export const threshold = 1.5;

async function getDifficultyProportion(blockNumber:number, blockDifficultyGetter:BlockDifficultyGetter):Promise<number>{
  const prevBlockDifficulty = await blockDifficultyGetter.getBlockDifficulty(blockNumber-1);
  const currentBlockDifficulty = await blockDifficultyGetter.getBlockDifficulty(blockNumber);
  const proportion =  currentBlockDifficulty/prevBlockDifficulty;
  return proportion;
}

function provideHandleBlock(blockDifficultyGetter: BlockDifficultyGetter): HandleBlock {
  return async function handleBlock(blockEvent: BlockEvent) {
    const findings: Finding[] = []
    const currentBlock = blockEvent.blockNumber;

    const Proportion: any = await getDifficultyProportion(currentBlock, blockDifficultyGetter);

    if (Proportion<threshold) {
      return findings;
    }
    findings.push(
      Finding.fromObject({
        name: "Difficulty detection",
        description: `Difficulty of the new block greater than ${threshold}`,
        alertId: "FORTA-6",
        severity: FindingSeverity.Info,
        type: FindingType.Suspicious,
        metadata: {
          block: currentBlock.toString()
        }
      }
    ))

    return findings
    }
  }
  export default {
    provideHandleBlock,

  };