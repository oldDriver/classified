/*global jasmine, describe, it, $, expect*/

'use strict';

var guid = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
};

var toRecord = function (table, proto) {
    var id = proto.id;
    var version = proto.version;

    delete proto.id;
    delete proto.version;

    return {
        id: id || guid(),
        version: version || guid(),
        proto: proto,
        table: table,
        permission: guid(),
        createdOn: proto.createdOn || (new Date()).getTime(),
        updatedOn: proto.createdOn || (new Date()).getTime()
    };
};

var toRecords = function (snapshot) {
    var result = [];

    for (var table in snapshot) {
        var items = snapshot[table];

        for (var i in items) {
            result.push(toRecord(table, items[i]));
        }
    }

    return result;
};

describe('Remove test - ', function () {
    describe('Check if remove functionality works - ', function () {
        var drafts = {
            Employee: {
                name: 'Atom',
                employer: 'Employer'
            },

            Employer: {
                name: 'Atom'
            }
        };

        it("check if 'Repo.remove' works properly", function () {
            var snapshot = {
                Employee: [{
                    id: '$rid-Bob',
                    version: '$vid-Bob',

                    name: 'Kyiv',
                    employer: '$rid-Smith'
                }, {
                    id: '$rid-Alice',
                    version: '$vid-Alice',

                    name: 'Alice',
                    employer: '$rid-Smith'
                }],

                Employer: [{
                    id: '$rid-Smith',
                    version: '$vid-Smith',

                    name: 'Smith'
                }]
            };

            var records = toRecords(snapshot);

            var repo = new Reflex.Repo(drafts);

            repo.merge(records);

            repo.remove('$vid-Alice');

            var reference = repo.references['$rid-Alice'];

            expect(reference).toBeDefined();
            expect(reference.versions['$vid-Alice']).toBeUndefined();
            expect(repo.versions['$vid-Alice']).toBeUndefined();

            debugger;
        });
    });
});
