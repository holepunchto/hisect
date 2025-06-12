const test = require('brittle')
const Hypercore = require('hypercore')
const hisect = require('./')

test('returns correct index for exact match', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['2', '4', '6', '8', '10']
  await core.append(data)
  const index = await hisect(core, 6, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 2)
  await core.close()
})

test('returns -1 when exact match not found', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['2', '4', '6', '8', '10']
  await core.append(data)
  const index = await hisect(core, 5, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, -1)
  await core.close()
})

test('returns -1 for empty list', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const index = await hisect(core, 1, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, -1)
  await core.close()
})

test('returns -1 when match would be past end', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['1', '2', '3']
  await core.append(data)
  const index = await hisect(core, 10, (target, block) => target - Number(block))
  t.is(index, -1)
  await core.close()
})

test('works when match is at the start', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['5', '6', '7', '8']
  await core.append(data)
  const index = await hisect(core, 5, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 0)
  await core.close()
})

test('hisect.lt returns index of value less than target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['2', '4', '6', '8'])
  const index = await hisect.lt(core, 6, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 1)
  await core.close()
})

test('hisect.lte returns index of value less than or equal to target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['2', '4', '8'])
  const index = await hisect.lte(core, 6, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 1)
  const equalIndex = await hisect.lte(core, 8, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(equalIndex, 2)
  await core.close()
})

test('hisect.gt returns index of value greater than target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['1', '3', '5', '7', '9'])
  const index = await hisect.gt(core, 5, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 3)

  const indexNotFound = await hisect.gt(core, 10, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexNotFound, -1)
  await core.close()
})

test('hisect.gte returns index of value greater than or equal to target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['1', '3', '5', '7', '9'])
  const index = await hisect.gte(core, 5, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 2)

  const indexGreater = await hisect.gte(core, 6, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexGreater, 3)
  const indexNotFound = await hisect.gte(core, 10, (target, block) => {
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexNotFound, -1)
  await core.close()
})
