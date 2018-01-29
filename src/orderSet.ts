import * as Table  from 'cli-table'

/**
 * Represents an order.
 * @constructor
 * @param {array} row - array representing csv row
 */
class Order{
    private _data: [number, string, string, string]
    orderId:number;
    companyName: string;
    customerAddress: string;
    orderItem: string;
    constructor(row){
        row[0] = Number.parseInt(row[0])
        this._data = row;
        this.orderId = this._data[0];
        this.companyName = this._data[1];
        this.customerAddress = this._data[2];
        this.orderItem = this._data[3];
    }
    get data(){
        return this._data;
    }
}

/**
 * Represents a collection of Orders.
 */
export
class OrderSet{
    _set:Array<Order>;
    ordersHeader: Array<string>;
    freqHeader: Array<string>;
    constructor(){
        this._set = [];
        this.ordersHeader = ['OrderId', 'CompanyName', 'CustomerAddress', 'Item']
        this.freqHeader = ['Item', 'OrderFrequancey']
    }
    /* adds order with predefined id */
    append(newOrder){
        let order = new Order(newOrder);
        this._set.push(order)
    }
    /* adds order without predefined id, gives it id using auto increment*/
    createOrder(newOrder){
        let setLength = this._set.length 
        let newID
        if (setLength == 0){
            newID = 1
        }else{
            newID = this._set[setLength - 1].orderId + 1
        }
        newOrder.unshift(newID)
        let order = new Order(newOrder);
        this._set.push(order)
        this.sortOrders()
    }
    sortOrders(){
        this._set.sort((x, y)=>{
            return x.orderId -  y.orderId;
        })
    }
    findByCompany(company): Table{
        let table = new Table({
            head: this.ordersHeader
        });
        this._set.forEach((order)=>{
            if( order.companyName == company){
                table.push(order.data)
            }
        })
        return table
    }
    findByAddress(address): Table{
        let table = new Table({
            head: this.ordersHeader
        });
        this._set.forEach((order)=>{
            if( order.customerAddress == address){
                table.push(order.data)
            }
        })
        return table
    }

    deleteOrder(id){
        for(let i=0; i<=this._set.length-1;i++){
            if (this._set[i].orderId == id){
                this._set.splice(i, 1)
            }
        }
        return this.showOrders()

    }
    itemFrequency(){
        let table = new Table({
            head: this.freqHeader
        });

        let total = {}
        for(let order of this._set){
            if (order.orderItem in total){
                total[order.orderItem]++
            }else{
                total[order.orderItem] = 1
            }
        }
        Object.keys(total).map((key)=>{
            table.push([key, total[key]])
        })
        table.sort((x, y)=>{
            return  y[1] - x[1];
        })

        return table
    }
    showOrders(){
        let table = new Table({
            head: this.ordersHeader
        });
        this._set.forEach((order)=>{
            table.push(order.data)
        })
        return table
    }
    updateOrder(id, updatedOrder){
        for(let i=0; i<=this._set.length-1;i++){
            if (this._set[i].orderId == id){
                this._set.splice(i, 1)
            }
        }
        this.append(updatedOrder)
        this.sortOrders()
    }
}
