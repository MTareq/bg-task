### Introduction:

This is an interactive shell to process a list of orders from csv file
or create a new one from scratch.

### Requirements:

* node >= 8

### Dependecies:

* `fastcsv`
* `vorpal`
* `table-cli`

### Installation:

* `npm install` or `yarn`

### Run:

* `npm run start`

### Commands:

* help [command...]        Provides help for a given command.
* exit                     Exits application.
* import <path>            Initialize using csv file relative path.
* new                      Initialize empty OrderSet.
* findbycompany <company>  Find order by Company.
* findbyaddress <address>  Find order by Customer Address.
* delete <id>              Delete order by ID.
* add <order>              Add new order => 'company,address,item'.
* update <id> <order>      Update order given orderID => 'company,address,item'.
* show_frequency           List all order items based on frequency of orders.
* export <name>            Exports current data set to csv.

### CSV Input Schema:

```csv
    002,Cheapskates,Reeperbahn 153,Macbook
    6,MegaCorp,Reeperbahn 153,Playstation
``` 
  * each line represented as `orderId,companyName,CustomerAddress,orderItem`.
  * Due to some `fastcsv` constraints it better not have spaces between commas.
  * No support for csv headers.

### Testing:

* `npm run test`
