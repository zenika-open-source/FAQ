# Contributing

So you want to contribute to this project? Awesome!

Below are some useful information in order to get you started.

You will need to follow the [installation process](/docs/installation.md) first.

## Contributing process

- You found a bug? You have a suggestion? Great! [Open an issue](https://github.com/Zenika/FAQ/issues) so we can discuss it
- You want to implement changes to the code? Awesome! [Open a pull request](https://github.com/Zenika/FAQ/pulls) so we can review it

## Tests

> /!\ There is currently no tests for this project

## Linting

Run the linter using the following command

```bash
npm run lint
```

## Bundle size

We try to minimize the size of the js bundle. You can use the webpack analyzer to check if new dependencies are lightweight or not.

```bash
npm run stats
```

This commands generate a `stats.json` file which you can vizualize on this [website](https://chrisbateman.github.io/webpack-visualizer/)

## Algolia Synonyms

To add a synonym for Algolia's full-text search, modify the [synonyms.json](server/algolia/synonyms.json) file. ([Algolia documentation on synonyms](https://www.algolia.com/doc/guides/textual-relevance/synonyms/))
