/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import { assert } from 'chai'
import { suite, test, slow, timeout } from 'mocha-typescript'
import {OrderSet} from '../src/orderSet'
import { connect } from 'net';
import { watch } from 'fs';
import { setTimeout } from 'timers';

var testData = [
   ['001','SuperTrader','Steindamm 80','Macbook'],
   ['002','MegaCorp','Reeperbahn 153',"Book 'Guide To Hamburg'"],
   ['003','Cheapskates','Reeperbahn 153','Macbook'],
   ['004','SuperTrader','Sternstrasse 125',"Book 'Cooking 101'"]
]

@suite class TestOrderSet{
    @test testConstructor(){
        var testSet = new OrderSet();
        let set  = testSet._set;
        assert.equal(set.length, 0)
    }
    @test testAppend(){
        let testSet = new OrderSet();
        testSet.append(testData[0])
        let expected = [1,'SuperTrader','Steindamm 80','Macbook'] 
        assert.equal(testSet._set[0].orderId, expected[0])
        assert.equal(testSet._set[0].companyName, expected[1])
        assert.equal(testSet._set[0].customerAddress, expected[2])
        assert.equal(testSet._set[0].orderItem, expected[3])
    }
    @test testCreateOrder(){
        /* data set must be initiated first with atleas one value */
        let testSet = new OrderSet();
        let testOrder = [1,'SuperTrader','Steindamm 80','Macbook']
        let testOrder2 = ['Cheapskates','Reeperbahn 153','Macbook']
        let expected = [2, 'Cheapskates','Reeperbahn 153','Macbook']
        testSet.append(testOrder)
        testSet.createOrder(testOrder2)
        assert.equal(testSet._set[1].orderId, expected[0])
        assert.equal(testSet._set[1].companyName, expected[1])
        assert.equal(testSet._set[1].customerAddress, expected[2])
        assert.equal(testSet._set[1].orderItem, expected[3])

    }
    @test testSortOrders(){
        let testSet = new OrderSet();
        let orderData = [[2,'Cheapskates','Reeperbahn 153','Macbook'],
                          [1,'SuperTrader','Steindamm 80','Macbook']]
        for (let order of orderData){
            testSet.append(order)
        }
        assert.equal(testSet._set[0].orderId, 2)
        testSet.sortOrders()
        assert.equal(testSet._set[0].orderId, 1)
    }
    @test testFindByCompany(){
        let testSet = new OrderSet();
        for (let order of testData){
            testSet.append(order)
        }
        let set  = testSet._set;
        assert.equal(set.length, 4)
        let found = testSet.findByCompany('SuperTrader')
        assert.equal(found.length, 2)
        for (let order of found){
            assert.equal(order[1], 'SuperTrader')
        }
    }
    @test testFindByAddress(){
        let testSet = new OrderSet();
        for (let order of testData){
            testSet.append(order)
        }
        let set  = testSet._set;
        assert.equal(set.length, 4)
        let found = testSet.findByAddress('Reeperbahn 153')
        assert.equal(found.length, 2)
        for (let order of found){
            assert.equal(order[2], 'Reeperbahn 153')
        }
    }
    @test testDeleteOrder(){
        let testSet = new OrderSet();
        for (let order of testData){
            testSet.append(order)
        }
        let set  = testSet._set;
        assert.equal(set.length, 4)
        testSet.deleteOrder(2)
        assert.equal(set.length, 3)
    }
    @test testItemFrequancey(){
        let testSet = new OrderSet();
        for (let order of testData){
            testSet.append(order)
        }
        let freqResult = testSet.itemFrequency()
        assert.equal(freqResult[0][0], 'Macbook')
        assert.equal(freqResult[0][1], 2)
        assert.equal(freqResult[1][0], "Book 'Guide To Hamburg'")
        assert.equal(freqResult[1][1], 1)
    }
    @test testUpdateOrder(){
        let testSet = new OrderSet();
        for (let order of testData){
            testSet.append(order)
        }
        testSet.updateOrder(2, [2, 'MegaCorp','Steindamm 80',"Book 'Guide To Cairo'"])
        let expectedItem = "Book 'Guide To Cairo'"
        assert.equal(testSet._set[1].orderItem, expectedItem)
    }
}
