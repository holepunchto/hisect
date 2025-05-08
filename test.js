const test = require('brittle')
const bisect = require('./')

test('returns correct index for exact match', async (t) => {
  const core = {
    length: 5,
    get: async (i) => [2, 4, 6, 8, 10][i]
  }

  const index = await bisect(core, val => val - 6)
  t.is(index, 2)
})

test('returns -1 when exact match not found', async (t) => {
  const core = {
    length: 5,
    get: async (i) => [2, 4, 6, 8, 10][i]
  }

  const index = await bisect(core, val => val - 5) // 5 not in list
  t.is(index, -1)
})

test('returns -1 for empty list', async (t) => {
  const core = {
    length: 0,
    get: async () => undefined
  }

  const index = await bisect(core, val => val - 1)
  t.is(index, -1)
})


test('returns -1 when match would be past end', async (t) => {
  const core = {
    length: 3,
    get: async (i) => [1, 2, 3][i]
  }

  const index = await bisect(core, val => val - 10)
  t.is(index, -1)
})

test('works when match is at the start', async (t) => {
  const core = {
    length: 4,
    get: async (i) => [5, 6, 7, 8][i]
  }

  const index = await bisect(core, val => val - 5)
  t.is(index, 0)
})
