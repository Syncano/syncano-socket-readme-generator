# Syncano Socket Readme Generator

This CLI tool was created for Syncano Socket developers. It will let you generate a `README.md` file out of the Syncano `socket.yml` spec.
Currently, the supported `socket.yml` properties are:
 - Config
 - Classes
 - Endpoints

And basic keys: name, description and version.

## Usage

```
npx s-readme socket.yml
```

The `README.md` file will be generated in the current working directory.
In case a `README.md` file already exists in the directory, the tool will ask to overwrite it.

## Tests

To run tests:

```
npm run test
```

or with watch:

```
npm run test:watch
```

End to end tests use a sample `test.yml` file located in `assets` folder to generate a markdown file for comparison. Use the `test.yml` as a reference point or create another one for e2e test variations.

