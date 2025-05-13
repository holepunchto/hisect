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
