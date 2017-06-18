# Building a Node + Express.js Rest API server using a repository pattern

This is a complete example of a `Rest API server` which manages two collections: Post and BlogCategory.

Both are defined on `app.js` file and for the CRUD operations share the same route modules on `routes` folder. Their specific data mappers and repositories are created outside and passed using the dependency injection.

Routes objects validate their parameters or body data with the validators on `routes/validators` and dialog with the database using the injected repository methods.

In each collection a resource is identified by an unique id created with the UID lib.

The data transfer objects definitions are on `dto` folder and each of them has an own mapper to a repository entity object defined on `entities` folder. The mapping operations among dto objects and entities are performed by routes before sending and after receiving repository data.

The database used for development and testing purpose is `ForeRunnerDB` and the repository classes are on `repositories/ForeRunnerDB` folder. For other databases support it would be enough to write a new specific repository class and inject it on route creation.

--------------------------------------------------------------------------------

## Getting Started

The test server is a Node/Express.js app running on localhost:4000\. If you want to modify the app port, change the configuration file `config/default.yaml`.

Data are saved using the database [ForerunnerDB](https://github.com/Irrelon/ForerunnerDB).

The tests on `test/e2e` folder show the different API usage.

--------------------------------------------------------------------------------

### Prerequisites

What things you need to install the software

```
Node.js 6.0+
```

--------------------------------------------------------------------------------

### Installing

The easiest way to get started is to clone the repository:

```
# Get the latest snapshot
git clone https://github.com/claclacla/Building-a-Node-Express.js-Rest-API-server-using-a-repository-pattern

# Change directory
cd Building-a-Node-Express.js-Rest-API-server-using-a-repository-pattern

# Install NPM dependencies
npm i
```

--------------------------------------------------------------------------------

### Usage

```
# Change directory
cd Building-a-Node-Express.js-Rest-API-server-using-a-repository-pattern

# Start the API server using node
npm start

# Test it using...

npm run unit-test
# ...to test server code

npm run e2e-test
# ...to test the collections API
```

--------------------------------------------------------------------------------

## Authors

- **Simone Adelchino** - [_claclacla_](https://twitter.com/_claclacla_)

--------------------------------------------------------------------------------

## License

This project is licensed under the MIT License

--------------------------------------------------------------------------------

## Acknowledgments

- [HTTP handling in Node.js](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
