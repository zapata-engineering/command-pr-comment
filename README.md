# Command PR Comment

<p align="center">
  <a href="https://github.com/zapatacomputing/command-pr-comment/actions"><img alt="javscript-action status" src="https://github.com/zapatacomputing/command-pr-comment/workflows/units-test/badge.svg"></a>
</p>

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: zapatacomputing/command-pr-comment@v1
with:
  command: make show-coverage-text-report
  template: "🚀 Code Coverage\n```\n%command%```"
  update-text: "🚀 Code Coverage"
```

## Development

You can install the dependencies with `npm`.

```bash
npm install
```


## Package for distribution

GitHub Actions will run the entry point from the `action.yml`. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged `index.js` is run from the `dist` directory, this will need to be updated when you make changes to `index.js`.

```bash
git add dist
git commit
```

## Create a release branch

Users shouldn't consume the action from `main` since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
