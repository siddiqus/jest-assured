# Jest-Assured

A batteries-included TypeScript-first E2E test framework.

- Features:
  - API client through axios
  - Database clients through sequelize
  - Provider configurations through environment variables
  - Type intellisense for configured API and DB providers
  - Auto generated tests from json declaration

# Quick Start
Let's say you want to write API integration tests for `jsonplaceholder` API.

1. Add a property in the `api` array in `.jest-assured.config.ts`
2. Add your API configurations e.g. base URL and headers in the `.env` file (see `.env.example`)
3. Write your tests! (see `jsonplaceholder.test.ts` for example)

# Core Concepts
This repo was built for easily writing integration tests and end-to-end tests using API calls and database queries.

Let's imagine you have an API workflow for creating an order in an ecommerce system. You would probably be interacting with an order service, customer service, and inventory service to complete placing the order. It might look something like this:

```
1. Input data would be customer ID, product IDs and respective quantities
2. fetch customer from Customers service by ID, and validate
3. fetch product inventory by product IDs from Inventory service, and validate
4. POST the order creation data to the Orders service to create the order, the API response should have a new Order object with the order ID
5. Query the database with the order ID and validate that the necessary information exists in the database
```

This framework allows you to do this easily through code. All you need to do is configure your API services (i.e. orders, customers, inventory) with their respective API urls and keys, and your database (e.g. orders_staging, orders_production etc.), and utilize this repo's common utility functions to do what you need to.

# Setup

For API integration tests, each API service should have a key definition in the configuration. All autowiring will happen based on this key. We are using `jsonplaceholder` as an example of an API service. This key must be present in the following:

## `.jest-assured.config.ts` file
```javascript
export default {
  providers: {
    api: ['jsonplaceholder'], // api or service names go here
    db: [], // similar to APIs, individual database names go here
  }
} as const
```

The above is provided in this repo as an example. For each API service you wish to test, for example if you have multiple microservices, one for `customers` and another for `orders`, in that case you should include those in the `api` array property like so:

- `api: ['customers', 'orders']`

This will allow intellisence for our utilities / core functions. Of course, these are just the names of the services. To add configurations (e.g. API keys, etc.) we should use the `.env` file.

## `.env` file


For all services, the ENV file should contain the base url and the appropriate headers as a json string, as shown in the `.env.example` file
  - **jsonplaceholder**_API_BASE_URL=https://jsonplaceholder.typicode.com
  - **jsonplaceholder**_API_HEADERS_JSON={ "X-Auth-Token": "1234" }

So for example, if we were to add a new config for a microservice called "customers", then the `.env` config would look like this:
  - **customers**_API_BASE_URL=https://jsonplaceholder.typicode.com
  - **customers**_API_HEADERS_JSON={ "X-Auth-Token": "1234" }


# Folder Structure

- src
  - autoapi
    - jsonplaceholder
       - healthcheck.json
  - services
    - jsonplaceholder.ts
  - suites
    - jsonplaceholder.test.ts
