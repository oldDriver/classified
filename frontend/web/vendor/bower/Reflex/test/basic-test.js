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

describe('Basic workflows tests', function () {
  describe('Model, City, Country, Person based drafts', function () {
    var drafts = {
      ModelA: {
        modelB: 'ModelB'
      },

      ModelB: {
        value: 'Atom'
      }
    };

    it("should clean out owners dictionary properly", function () {
      var snapshot = {
        ModelA: [{
          id: '001',
          version: '0011',

          modelB: '003'
        }, {
          id: '002',
          version: '0021',

          modelB: '003'
        }],

        ModelB: [{
          id: '003',
          version: '0031',

          value: 'xxx'
        }]
      };

      var records = toRecords(snapshot);

      var repo = new Reflex.Repo(drafts);

      repo.merge(records);

      var edit = new Reflex.Repo(drafts);

      var checkout = repo.checkout(['001', '002']);

      edit.merge(checkout);

      edit.remove('001');
      edit.remove('002');

      var diff = edit.diff();

      repo.merge(diff);
    });
  });
});
