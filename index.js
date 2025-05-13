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

module.exports = hisect
