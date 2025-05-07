const test = require('brittle')
const bisect = require('./')

test('exact match returns correct index', async (t) => {
  const core = {
    length: 5,
    get: async (i) => [1, 3, 5, 7, 9][i]
  }

  const idx = await bisect(core, (val) => val - 5)
  t.is(idx, 2)
})

test('returns 0 if value less than all elements', async (t) => {
  const core = {
    length: 5,
    get: async (i) => [10, 20, 30, 40, 50][i]
  }

  const idx = await bisect(core, (val) => val - 5)
  t.is(idx, 0)
})

test('returns length if value greater than all elements', async (t) => {
  const core = {
    length: 4,
    get: async (i) => [10, 20, 30, 40][i]
  }

  const idx = await bisect(core, (val) => val - 100)
  t.is(idx, 4)
})
