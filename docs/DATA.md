# Data Collecting

## Fractals

Go to https://wiki.guildwars2.com/wiki/Fractals_of_the_Mists and run:

```js
;[...document.querySelectorAll('.pve.table')]
  .filter((e) => e.innerText.includes('Level'))
  .flatMap((t) => [...t.querySelectorAll('tr')])
  .map((r) => {
    const cells = [...r.querySelectorAll('td')]
    if (cells.length !== 2) return
    return {
      level: 0,
      fractal: cells[0].innerText.trim(),
      AR: parseInt(cells[1].innerText, 10),
    }
  })
  .filter(Boolean)
  .map((e, i) => ({ ...e, level: i + 1 }))
```
