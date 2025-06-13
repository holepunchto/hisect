# hisect

Binary search on a Hypercore.

Pass a comparator. Gets you the index of the first block that matches, or -1 if not found.

```js
npm install hisect
```

## Usage

```js
import hisect from 'hisect'
import Hypercore from 'hypercore'
import b4a from 'b4a'

const core = new Hypercore('./core')
await core.ready()

for (let i = 0; i <= 10000; i++) {
  await core.append(b4a.from(`${i}`))
}

const since = 9999
const index = await hisect(core, since, (since, block) => {
  const value = Number(b4a.toString(block))
  if (value < since) return -1
  if (value > since) return 1
  return 0
})

console.log('Start index:', index)
```
Once you have the index, you can stream from it or do whatever.

```js
const stream = core.createReadStream({ start: index })
for await (const data of stream) {
  console.log(b4a.toString(data))
}
```

## API

```js
const index = await hisect(core, target, compare)
```
Does a binary search over the blocks in core. compare is a sync function that receives the block and should return:

- < 0 if the target is after this block

- \> 0 if the target is before this block

- 0 if it's a match

Returns the index of the first matching block. If there's no match, returns -1.

#### `hisect.lte`

#### `hisect.lt`

#### `hisect.gte`

#### `hisect.gt`

