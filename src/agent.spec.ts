import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleBlock,
  createBlockEvent
} from "forta-agent";
import agent, { threshold } from "./agent"

const blocks : {[key: number]: number} = {
  123 : 50,
  124 : 300,
  125 : 310,
}


const blockEvent = (blockNumber : number) =>createBlockEvent({
  block: { hash: "0xa", number: blockNumber} as any
})


  describe("Difficulty checking agent", () => {
    const mockDifficultyGetter = {
      getBlockDifficulty : jest.fn((blockNumber) => blocks[blockNumber])
    } as any

    const handleBlock : HandleBlock = agent.provideHandleBlock(mockDifficultyGetter);

    it("returns empty findings if proportion is below threshold", async () => {
      const block_event = blockEvent(125);
      const findings = await handleBlock(block_event)
      expect(findings).toStrictEqual([])
    })
    it("returns findings if proportion is above threshold", async () =>{
      const block:number = 124;
      const block_event = blockEvent(block)
      const findings = await handleBlock(block_event)
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Difficulty detection",
          description: `Difficulty of the new block greater than ${threshold}`,
          alertId: "FORTA-6",
          severity: FindingSeverity.Info,
          type: FindingType.Suspicious,
          metadata: {
            block: block.toString()
          }
        })
      ])
    })

  })


