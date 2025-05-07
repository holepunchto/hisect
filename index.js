async function bisect (core, cmp) {
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

  return low
}

module.exports = bisect
