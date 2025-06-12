async function hisect (core, target, cmp) {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(target, block)
    if (res < 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low < core.length) {
    const block = await core.get(low)
    if (cmp(target, block) === 0) {
      return low
    }
  }

  return -1
}

hisect.gte = async (core, target, cmp) => {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(target, block)
    if (res < 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low < core.length) {
    const block = await core.get(low)
    if (cmp(target, block) >= 0) {
      return low
    }
  }

  return -1
}

hisect.gt = async (core, target, cmp) => {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(target, block)
    if (res <= 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low < core.length) {
    const block = await core.get(low)
    if (cmp(target, block) > 0) {
      return low
    }
  }

  return -1
}

hisect.lt = async (core, target, cmp) => {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(target, block)
    if (res < 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  if (low > 0) {
    const block = await core.get(low - 1)
    if (cmp(target, block) <= 0) {
      return low - 1
    }
  }

  return -1
}

hisect.lte = async (core, target, cmp) => {
  let low = 0
  let high = core.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await core.get(mid)

    const res = cmp(target, block)
    if (res > 0) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  if (low > 0) {
    const block = await core.get(low - 1)
    if (cmp(target, block) <= 0) {
      return low - 1
    }
  }

  return -1
}

module.exports = hisect
