**The University of Melbourne**

# INFO30005 – Web Information Technologies

# Group Project Repository

## Table of contents

- [INFO30005 – Web Information Technologies](#info30005--web-information-technologies)
- [Group Project Repository](#group-project-repository)
  - [Table of contents](#table-of-contents)
  - [Team Members](#team-members)
  - [General info](#general-info)
  - [Technologies](#technologies)
  - [Server Mockup](#server-mockup)
    - [Server URL](#server-url)
    - [Postman](#postman)
      - [Viewing full menu of the snack](#viewing-full-menu-of-the-snack)
      - [View details of a snack](#view-details-of-a-snack)
      - [Customer starts a new order by requesting a snack](#customer-starts-a-new-order-by-requesting-a-snack)
      - [Setting van status (Vendor sends location marks van ready for orders)](#setting-van-status-vendor-sends-location-marks-van-ready-for-orders)
      - [Show list of all outstanding orders](#show-list-of-all-outstanding-orders)
      - [Mark an order as "fulfilled" (ready to be picked up by customer)](#mark-an-order-as-fulfilled-ready-to-be-picked-up-by-customer)
    - [Other routes](#other-routes)
      - [Add new customer (for sign-up functionality later)](#add-new-customer-for-sign-up-functionality-later)
      - [Add new vendor](#add-new-vendor)
      - [Get all open vendors](#get-all-open-vendors)
    - [Database](#database)

## Team Members

| Name                 | Student ID |   Task   | State |
| :------------------- | :--------: | :------: | ----: |
| Cynthia              |  1086213   | Back End |  Done |
| Jonathan Jauhari     |  1038331   | Back End |  Done |
| Mei Chuan Lu         |  1068282   | Back End |  Done |
| MH Lu                |  1068283   | Back End |  Done |
| Yan-Ting Justin Chen |  1086022   | Back End |  Done |

## General info

This is project `Snacks in a Van`.
It is a web app with two interfaces: one that allows customers to view the
menu of snacks, find and order snacks from food trucks that work as popup
cafes, and the other one allows vendors to set the status such as their
location, marking vans as ready-for-orders and show all the outstanding
orders, and mark them as fulfilled.

## Technologies

This project was created with:

- NodeJs: 12.18.4
- dotenv: 8.2.0
- body-parser: 1.19.0
- express: 4.17.1
- mongoose: 5.12.3
- uuid: 8.3.2

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

## Server Mockup

### Server URL

Access the server via this [heroku link](https://snacks-in-a-van-roboto.herokuapp.com/)

### Postman

The required functionalities is implemented via different access routes.
Hostname of the website: `https://snacks-in-a-van-roboto.herokuapp.com/`

#### Viewing full menu of the snack

Using the `GET` method to the path `/customer/menu` under the hostname will
return a list of all the snacks. Sample output:

```_
[
    {
        "_id": "608128b9044ad81c68e1b711",
        "snackId": "5",
        "snackName": "Plain biscuit",
        "price": 3.5,
        "imageURL": "https://images.unsplash.com/photo-1598977801327-b21fe652e851?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
        "__v": 0
    },
    {
        "_id": "608128b9044ad81c68e1b70d",
        "snackId": "1",
        "snackName": "Cappuccino",
        "price": 4.5,
        "imageURL": "https://images.unsplash.com/photo-1531441802565-2948024f1b22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        "__v": 0
    },
    ...
]
```

#### View details of a snack

Using the `GET` method to the path `/customer/menu/:snackId` under the
hostname will return the details of the snack. Don't forget to replace the
`snackId` with the `snackId` propert of the snack that you want.

If the snack is not found in the menu, this will return `"Snack not found"`.
Sample output for `GET /customer/menu/5`:

```_
{
    "_id": "608128b9044ad81c68e1b711",
    "snackId": "5",
    "snackName": "Plain biscuit",
    "price": 3.5,
    "imageURL": "https://images.unsplash.com/photo-1598977801327-b21fe652e851?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
    "__v": 0
}
```

#### Customer starts a new order by requesting a snack

Using the `POST` method to the path `/customer/:customerId/order` where
`customerId` is a route parameter and is to be replaced with a value from
`customerId` property of the customer who is starting an order. A request
body in the format of: `{ snackName, quantity, vendorName }` is expected. An
order document will be created and inserted into the `orders` collection in
the database. The new order document will have an unique Id - `orderId`, and
the `orderId` of newly created order will be inserted into array of orders
(`orders`) property of the ordering customer

For `POST /customer/f9f8e2ea-a3a3-4003-97d9-ce1f1e7b31f6/order`
with body:

```_
{
    "snackName": "Plain biscuit",
    "quantity": 3,
    "vendorName": "ASD AND CO"
}
```

The sample output is:

```_
{
    "status": "preparing",
    "discountApplied": false,
    "_id": "60822f29094d8c2448fa2953",
    "orderId": "a8f47c55-2f5f-43b8-8d4b-0753e0090642",
    "vendor": "ASD AND CO",
    "items": [
        {
            "_id": "60822f29094d8c2448fa2954",
            "snack": "5",
            "quantity": 3
        }
    ],
    "timeOrdered": "2021-04-23T02:21:29.742Z",
    "__v": 0
}
```

The new order will be reflected in the customer's list of orders (there is
currently no public route to fetch this):

```_
{
  "_id": {
    "$oid": "608122a5d4a6e00cb4d21fed"
  },
  "orders": [
    "ed7a3b66-391f-4e5b-8ba6-b2754072c134",
    "41b3ea9e-e7a4-4461-bfd1-091751002370",
    "454bec0a-3c52-4d57-89d6-89bdc54f4a09",
    "3042d8cf-50ba-47cc-8f1a-2248102d56df",
    "a8f47c55-2f5f-43b8-8d4b-0753e0090642"
  ],
  "customerId": "f9f8e2ea-a3a3-4003-97d9-ce1f1e7b31f6",
  "email": "asdasd@asdas.com",
  "familyName": "ASDASDD",
  "givenName": "pptx",
  "password": "hihi",
  "__v": {
    "$numberInt": "0"
  }
}
```

#### Setting van status (Vendor sends location marks van ready for orders)

Using the `PUT` method to the path `vendor/:vendorName/status` under the
hostname will allow a vendor to set the status to open and close. If `open`
is false and is to be set to `true`, we can do a request body in the format of:

```_
{
  "open": true,
  "lat": 123.45,
  "lon": 54.321,
  "address': "sample address"
}
```

if `open` is `true` and is to be set to `false`, then any `lat`, `lon` and
`address` in the request will be ignored and they will be set to `null` in
the database.

```_
{
  "open": false,
  "lat": null,
  "lon": null,
  "address": null,
}
```

#### Show list of all outstanding orders

Using the `GET` method to the path `vendor/:vendorName/order` under the host
name will allow a specific vendor to access the outstanding list of orders,
i.e. orders with status `"preparing"`. Don't forget it only shows the orders
for that specific van. The outstanding orders are sorted by order time,
earlier outstanding orders appear first.

Sample output for `POST /vendor/ASD%20AND%20CO/order` (van name is
`ASD AND CO`):

```_
[
    {
        "status": "preparing",
        "discountApplied": false,
        "_id": "60812bd262b99f169cbeb541",
        "orderId": "ed7a3b66-391f-4e5b-8ba6-b2754072c134",
        "vendor": "ASD AND CO",
        "items": [
            {
                "_id": "60812bd262b99f169cbeb542",
                "snack": "5",
                "quantity": 46
            }
        ],
        "timeOrdered": "2021-04-22T07:54:58.805Z",
        "__v": 0
    },
    {
        "status": "preparing",
        "discountApplied": false,
        "_id": "60812be162b99f169cbeb543",
        "orderId": "41b3ea9e-e7a4-4461-bfd1-091751002370",
        "vendor": "ASD AND CO",
        "items": [
            {
                "_id": "60812be162b99f169cbeb544",
                "snack": "6",
                "quantity": 45
            }
        ],
        "timeOrdered": "2021-04-22T07:55:13.266Z",
        "__v": 0
    },
    ...
]
```

#### Mark an order as "fulfilled" (ready to be picked up by customer)

Using the `PUT` method to the path `vendor/:vendorName/order/:orderId/status`
under the host name will allow us to mark an order from `preparing` to
`fulfilled` and change the `timeFulfilled` to the time marked. It will also
be sorted from the oldest order to the newest one.

Sample output for
`PUT /vendor/ASD%20AND%20CO/order/41b3ea9e-e7a4-4461-bfd1-091751002370/status`
is `"Order status updated!"`.

If the order does not exist or is already marked as `fulfilled`, then the output
is `"Order not found :^("`.

This will be reflected in the `ASD AND CO`'s list of outstanding orders.

### Other routes

Some routes beyond the specification were added to accomodate future
functionalities, and for ease of testing.

#### Add new customer (for sign-up functionality later)

Using the `POST` method to the path `/customer` under the host name will
allow us to add a new customer by creating them based on the customer model.
The new customer will be assigned a customer ID after sign up.

For `POST /customer/` with body:

```_
{
 "email": "new@customer.com",
 "familyName": "Customer",
 "givenName": "New",
 "password": "test123"
}
```

The sample output is:

```_
{
    "orders": [],
    "_id": "60823667154ad12868ee5b47",
    "customerId": "dc4b1579-129a-47b3-a326-4baf8eb6287a",
    "email": "new@customer.com",
    "familyName": "Customer",
    "givenName": "New",
    "password": "test123",
    "__v": 0
}
```

#### Add new vendor

Using the `POST` method to the path `/vendor` under the host name will
allow us to add a new vendor by creating them based on the vendor model.
Newly created vendors will start off closed.

For `POST /vendor/` with body:

```_
{
    "vendorName":"lorem-ipsum",
    "password": "dolor-sit-amet"
}
```

The sample output is:

```_
{
    "_id": "6082354c154ad12868ee5b46",
    "vendorName": "lorem-ipsum",
    "password": "dolor-sit-amet",
    "open": false,
    "__v": 0
}
```

#### Get all open vendors

Using the `GET` method to the path `/vendor` under the host name will allow
us to get all the vendors that are currently open.

Sample output for `GET /vendor/`

```_
[
    {
        "_id": "6081240dd1e2673eb089ef89",
        "vendorName": "ASD AND CO",
        "password": "hihi",
        "open": true,
        "__v": 0,
        "address": "yapsa",
        "lat": 321,
        "lon": 123
    },
    {
        "_id": "6082354c154ad12868ee5b46",
        "vendorName": "lorem-ipsum",
        "password": "dolor-sit-amet",
        "open": true,
        "__v": 0,
        "address": "Melbourne Uni",
        "lat": 3,
        "lon": 4
    }
]
```

### Database

Access the database via [link](https://cloud.mongodb.com/v2/607a6469b3cdb46083865625#clusters)

- Connection string: `mongodb+srv://vendorsnacks:vendorsnacks@cluster0.7suke.mongodb.net/snacks?retryWrites=true&w=majority`
- DB username: `vendorsnacks`
- DB password: `vendorsnacks`
