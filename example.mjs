import hisect from './index.js'
import Hypercore from 'hypercore'
import b4a from 'b4a'

const core = new Hypercore('./core')
await core.ready()

for (let x = 0; x <= 10000; x++) {
  await core.append(b4a.from(`${x}`))
}

async function startLogging (core, since) {
  const startIndex = await hisect(core, since, (since, block) => {
    const value = Number(b4a.toString(block))
    if (value < since) return -1
    if (value > since) return 1
    return 0
  })

  console.log('Start index: ', startIndex)
  if (startIndex === -1) return

  const stream = core.createReadStream({ start: startIndex })
  for await (const entry of stream) {
    console.log(b4a.toString(entry))
  }
}

await startLogging(core, 9999)
