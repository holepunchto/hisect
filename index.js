const b4a = require('b4a')

async function hisect (core, cmp) {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(block)
    if (res < 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low < core.length) {
    const block = await core.get(low)
    if (cmp(block) === 0) {
      return low
    }
  }

  return -1
}

hisect.gte = async (core, since) => {
  return await hisect(core, (block) => {
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    if (value < since) return -1
    if (value > since) return 0
    return 0
  })
}

hisect.gt = async (core, since) => {
  return await hisect(core, (block) => {
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    if (value < since) return -1
    if (value > since) return 0
    return -1
  })
}

hisect.lte = async (core, since) => {
  const index = await hisect(core, (block) => {
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    return value <= since ? -1 : 0
  })

  if (index > 0) return index - 1

  if (index === 0) {
    const block = await core.get(0)
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    return value <= since ? 0 : -1
  }

  return -1
}

hisect.lt = async (core, since) => {
  const index = await hisect(core, (block) => {
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    return value < since ? -1 : 0
  })

  if (index > 0) return index - 1

  if (index === 0) {
    const block = await core.get(0)
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    return value < since ? 0 : -1
  }

  return -1
}

hisect.eq = async (core, since) => {
  return await hisect(core, (block) => {
    const value = Buffer.isBuffer(block) ? Number(b4a.toString(block)) : Number(block)
    if (value < since) return -1
    if (value > since) return 1
    return 0
  })
}

module.exports = hisect
