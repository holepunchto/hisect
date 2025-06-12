const test = require('brittle')
const Hypercore = require('hypercore')
const hisect = require('./')

test('returns correct index for exact match', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['2', '4', '6', '8', '10']
  await core.append(data)
  const index = await hisect(core, val => Number(val) - 6)
  t.is(index, 2)
})

test('returns -1 when exact match not found', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['2', '4', '6', '8', '10']
  await core.append(data)
  const index = await hisect(core, val => Number(val) - 5)
  t.is(index, -1)
})

test('returns -1 for empty list', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const index = await hisect(core, val => Number(val) - 1)
  t.is(index, -1)
})

test('returns -1 when match would be past end', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['1', '2', '3']
  await core.append(data)
  const index = await hisect(core, val => Number(val) - 10)
  t.is(index, -1)
})

test('works when match is at the start', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  const data = ['5', '6', '7', '8']
  await core.append(data)
  const index = await hisect(core, val => Number(val) - 5)
  t.is(index, 0)
})

test('hisect.lt returns index of value less than target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['2', '4', '6', '8'])
  const index = await hisect.lt(core, (block) => {
    const target = 6
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 1)
})

test('hisect.lte returns index of value less than or equal to target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['2', '4', '8'])
  const index = await hisect.lte(core, (block) => {
    const target = 6
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 1)
  const equalIndex = await hisect.lte(core, (block) => {
    const target = 8
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(equalIndex, 2)
})

test('hisect.gt returns index of value greater than target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['1', '3', '5', '7', '9'])
  const index = await hisect.gt(core, (block) => {
    const target = 5
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 3)

  const indexNotFound = await hisect.gt(core, (block) => {
    const target = 10
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexNotFound, -1)
})

test('hisect.gte returns index of value greater than or equal to target', async (t) => {
  const core = new Hypercore(await t.tmp(), { valueEncoding: 'utf-8' })
  await core.ready()
  await core.append(['1', '3', '5', '7', '9'])
  const index = await hisect.gte(core, (block) => {
    const target = 5
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(index, 2)

  const indexGreater = await hisect.gte(core, (block) => {
    const target = 6
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexGreater, 3)
  const indexNotFound = await hisect.gte(core, (block) => {
    const target = 10
    const value = Number(block)
    if (value < target) return -1
    if (value > target) return 1
    return 0
  })
  t.is(indexNotFound, -1)
})
