#! /usr/bin/node
import { setTimeout } from 'timers';
import { existsSync } from 'fs';
import * as Vorpal from 'vorpal';
import * as csv from 'fast-csv';
import { OrderSet } from './orderSet';

class Main{
    orderSet: OrderSet;
    shell: Vorpal;
    parser: any;
    constructor(){
        this.shell = new Vorpal;
        this.parser = csv;
        this.InitCmd();
    }
    InitCmd(){
        this.shell
            .delimiter("OrderProcessor::")
            .ui.imprint()
        this.shell
            .command('import <path>', 'initialize using csv file relative path')
            .action((args, done)=>{
                this.handleInit(args.path)
                let orders = this.orderSet.showOrders()
                done();
            })
        this.shell
            .command('new', 'initialize using csv file relative path')
            .action((args, done)=>{
                this.handleNew()
                let orders = this.orderSet.showOrders()
                done();
            })
        this.shell
            .command('findbycompany <company>', 'Find order by Company')
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleFindByCompany(args.company)
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell
            .command('findbyaddress <address>', 'Find order by Customer Address')
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleFindByAddress(args.address)
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell
            .command('delete <id>', 'Delete order by ID')
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleDelete(args.id)
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell
            .command('add <order>', "Add new order => 'company,address,item' ")
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleAddOrder(args.order)
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell
            .command('update <id> <order>', "Update order given orderID => 'company,address,item' ")
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleUpdateOrder(args.id, args.order)
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell
            .command('show_frequency', "List all order items based on frequency of orders")
            .action((args, done)=>{
                if(this.orderSet != undefined){
                    this.handleFrequency()
                }else{
                    this.shell.log("Please initialize an order set first using import command")
                }
                done();
            })
        this.shell.show();
    }

    handleInit(path){
        this.orderSet = new OrderSet;
        if (existsSync(path)) {
            this.parser
                .fromPath(path)
                .on("error", (err)=>{
                    this.shell.log(err)
                })
                .on("data-invalid", (data)=>{
                    this.shell.log(data)
                })
                .on("data", (data)=>{
                    this.orderSet.append(data)
                })
                .on("end", ()=>{
                    this.orderSet.sortOrders()
                    let orders = this.orderSet.showOrders()
                    this.shell.log(orders.toString())
                })
        } else{
            this.shell.log("file Does not exist")
        }
    }
    handleNew(){
        this.orderSet = new OrderSet;
        this.shell.log(`New Order Set Created you can start using it by using the add command`)
    }

    handleFindByCompany(company){
        let results:Array<any> = this.orderSet.findByCompany(company)
        this.shell.log(results.toString())
    }
    handleFindByAddress(address){
        let results:Array<any> = this.orderSet.findByAddress(address)
        this.shell.log(results.toString())
    }
    handleDelete(id){
        let results:Array<any> = this.orderSet.deleteOrder(id)
        this.shell.log(results.toString())
    }
    handleFrequency(){
        let results:Array<any> = this.orderSet.itemFrequency()
        this.shell.log(results.toString())
    }
    handleAddOrder(orderString){
        this.parser
            .fromString(orderString)
            .on("data", (data)=>{
                this.orderSet.createOrder(data)
            })
            .on("end", ()=>{
                let orders = this.orderSet.showOrders()
                this.shell.log(orders.toString())
            })
    }
    handleUpdateOrder(id, orderString){
        this.parser
            .fromString(orderString)
            .on("data", (data)=>{
                data.unshift(id)
                this.orderSet.updateOrder(id, data)
            })
            .on("end", ()=>{
                let orders = this.orderSet.showOrders()
                this.shell.log(orders.toString())
            })
    }
}

let program = new Main;
