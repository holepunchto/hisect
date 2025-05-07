import bisect from './index.js'
import Hypercore from 'hypercore'
import b4a from 'b4a'

const core = new Hypercore('./core')
await core.ready()

// for (let x = 0; x <= 10000; x++) {
//   await core.append(b4a.from(`${x}`))
// }

async function startLogging (core, since) {
  const startIndex = await bisect(core, (block) => {
    return block < since ? -1 : 1
  })

  console.log('Start index: ', startIndex)
  const stream = core.createReadStream({ start: startIndex })

  for await (const entry of stream) {
    console.log(b4a.toString(entry))
  }
}

await startLogging(core, 100001)
console.log(await core.get(130013))
