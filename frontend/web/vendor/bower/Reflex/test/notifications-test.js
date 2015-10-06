///*global jasmine, describe, it, $, expect*/
//
//'use strict';
//
//var guid = function () {
//    return Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
//            .toString(16)
//            .substring(1);
//};
//
//var toRecord = function (table, proto) {
//    var id = proto.id;
//    var version = proto.version;
//
//    delete proto.id;
//    delete proto.version;
//
//    return {
//        id: id || guid(),
//        version: version || guid(),
//        proto: proto,
//        table: table,
//        permission: guid(),
//        createdOn: proto.createdOn || (new Date()).getTime(),
//        updatedOn: proto.createdOn || (new Date()).getTime()
//    };
//};
//
//var toRecords = function (snapshot) {
//    var result = [];
//
//    for (var table in snapshot) {
//        var items = snapshot[table];
//
//        for (var i in items) {
//            result.push(toRecord(table, items[i]));
//        }
//    }
//
//    return result;
//};
//
//
//describe('Reflex tests', function () {
//    describe('Reflex notification system', function () {
//        it('should have proper interface', function () {
//            //debugger;
//            var results = [];
//
//            var declarations = {
//                Person: {
//                    name: 'Atom'
//                }
//            };
//
//            var person1_id = 'Person 1 id';
//            var snapshot = {
//                Person: [{
//                    id: person1_id,
//                    version: 'Persion 1 version 1',
//
//                    name: 'Mr. Person 1'
//                }]
//            };
//
//            var records = toRecords(snapshot);
//            var repo = new Reflex.Repo(declarations);
//
//            //debugger;
//            repo.on('referenceChanged', person1_id, function (id, reference, tableDescriptor) {
//                //debugger;
//            });
//            repo.on('referenceChanging', person1_id, function (id, reference, tableDescriptor, record) {
//                //debugger;
//            });
//            repo.on('tableChanged', 'Person', function (tableName, table) {
//                //debugger;
//            });
//            repo.on('tableChanging', 'Person', function (tableName, table) {
//                //debugger;
//            });
//
//            repo.merge(records);
//
//            //debugger;
//        });
//    });
//});
