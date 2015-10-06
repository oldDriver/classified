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


describe('Reflex', function () {
    describe('"Atom" type declaration', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Mr. Person 1'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    name: {type: 'Atom'}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Mr. Person 1'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    name: {type: {name: 'Atom'}}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Mr. Person 1'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });

    describe('"Array" type declaration', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Array', of: 'Atom'}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: ['Jorge', 'Fitzgerald', 'Jr.']
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Array', of: {type: 'Atom'}}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: ['Jorge', 'Fitzgerald', 'Jr.']
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Array', of: {type: {name: 'Atom'}}}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: ['Jorge', 'Fitzgerald', 'Jr.']
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });

    describe('"Hash" type declaration', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Hash', of: 'Atom'}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: {
                        firstName: 'Jorge',
                        lastName: 'Fitzgerald',
                        middleName: 'Jr.'
                    }
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Hash', of: {type: 'Atom'}}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: {
                        firstName: 'Jorge',
                        lastName: 'Fitzgerald',
                        middleName: 'Jr.'
                    }
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    names: {type: 'Hash', of: {type: {name: 'Atom'}}}
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    names: {
                        firstName: 'Jorge',
                        lastName: 'Fitzgerald',
                        middleName: 'Jr.'
                    }
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });


    describe('"Reference" type declaration', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    name: {type: 'Reference', of: 'Name'}
                },
                Name: {
                    value: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Full name id'
                }],

                Name: [{
                    id: 'Full name id',
                    version: 'Full name version',

                    value: 'Tyler Duran'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    name: {type: 'Reference', of: {type: 'Name'}}
                },
                Name: {
                    value: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Full name id'
                }],

                Name: [{
                    id: 'Full name id',
                    version: 'Full name version',

                    value: 'Tyler Duran'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    name: {type: 'Reference', of: {type: {name: 'Name'}}}
                },
                Name: {
                    value: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    name: 'Full name id'
                }],

                Name: [{
                    id: 'Full name id',
                    version: 'Full name version',

                    value: 'Tyler Duran'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });

    describe('nested type declaration', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    office: 'Office'
                },

                Office: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    office: {type: 'Office'}
                },

                Office: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    office: {type: {name: 'Office'}}
                },

                Office: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });

    describe('alias type declarations', function () {
        it('should be supported for short type signatures', function () {
            var declarations = {
                Person: {
                    office: 'Office'
                },

                Office: 'Building',

                Building: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);

            }).not.toThrow();
        });

        it('should be supported for medium type signatures', function () {
            var declarations = {
                Person: {
                    office: {type: 'Office'}
                },

                Office: 'Building',

                Building: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);

            }).not.toThrow();
        });

        it('should be supported for long type signatures', function () {
            var declarations = {
                Person: {
                    office: {type: {name: 'Office'}}
                },

                Office: 'Building',

                Building: {
                    name: 'Atom'
                }
            };

            var snapshot = {
                Person: [{
                    id: 'Person 1 id',
                    version: 'Person 1 version 1',

                    office: 'Office 1 id'
                }],

                Office: [{
                    id: 'Office 1 id',
                    version: 'Office 1 version 1',

                    name: 'Office one'
                }]
            };

            var records = toRecords(snapshot);

            expect(function () {
                var repo = new Reflex.Repo(declarations);

                repo.merge(records);
            }).not.toThrow();
        });
    });

    describe('type description exception', function () {
        it('should occur with \'Descriptor "Habra kadabra" not found\' when invalid declaration is provided', function () {
            var declarations = {
                Person: {
                    name: 'Habra kadabra'
                }
            };

            expect(function () {
                return new Reflex.Repo(declarations);
            }).toThrowError('Descriptor "Habra kadabra" not found');
        });

        it('should occur with \'Recursive type declaration of type "Person"\' when supplying recursive type declarations', function () {
            var declarations = {
                Person: 'Man',
                Man: 'Person'
            };

            expect(function () {
                return new Reflex.Repo(declarations);
            }).toThrowError('Recursive type declaration of type "Person"');
        });
    });

    describe('duplicate version exception', function () {
        it('should occur with \'Recursive type declaration of type "Person"\' when supplying recursive type declarations', function () {
            var declarations = {
                Person: 'Man',
                Man: 'Person'
            };

            expect(function () {
                return new Reflex.Repo(declarations);
            }).toThrowError('Recursive type declaration of type "Person"');
        });
    });

    describe('cleanup operation', function(){
        it('should work appropriately for version replacement case', function (){
            var declarations = {
                Person: {
                    office: {type: {name: 'Office'}}
                },

                Office: 'Building',

                Building: {
                    name: 'Atom'
                }
            };

            var repo = new Reflex.Repo(declarations);

            // Represents first operation
            var records_ajax1 = [{
                id: 'Person 1 id',
                version: 'Person 1 version 1',
                proto: {
                    office: 'Office 1 id'
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Office 1 id',
                version: 'Office 1 version 1',
                proto: {
                    name: 'Office one'
                },
                table: 'Office',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }];

            repo.merge(records_ajax1);

            var records_ajax2 = [{
                id: 'Office 1 id',
                version: 'Office 1 version 1',
                proto: null, // Instructs reflex to remove existing versions
                table: 'Office',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Office 1 id',
                version: 'Office 1 version 2',
                proto: {
                    name: 'Office one'
                },
                table: 'Office',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }];

            repo.merge(records_ajax2);

            expect(repo.tables['Office']['Office 1 id'].versions['Office 1 version 1']).toBeUndefined();
            expect(repo.tables['Office']['Office 1 id'].versions['Office 1 version 2']).not.toBeUndefined();
        });
    });

    describe('Indexing', function(){
        it('all functionality should work appropriately for a basic case', function () {
            var declarations = {
                Person: {
                    name: 'Atom',
                    description: 'Atom'
                }
            };

            var repo = new Reflex.Repo(declarations);

            var records_ajax1 = [{
                id: 'Person 1 id',
                version: 'Person 1 version 1 id',
                proto: {
                    name: 'Vasiliy',
                    description: undefined
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Person 2 id',
                version: 'Person 2 version 1 id',
                proto: {
                    name: 'Petro',
                    description: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Person 3 id',
                version: 'Person 3 version 1 id',
                proto: {
                    name: 'Ivan',
                    description: 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.'
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }];

            repo.merge(records_ajax1);

            var searchResults = [];

            repo.descriptors.Person.properties.description.intersect('always', null, function (searchResult) {
                searchResults.push(searchResult);
            });

            expect(searchResults.length).toBe(1);
            expect(searchResults[0].reference.id).toBe('Person 3 id');

            var records_ajax2 = [{
                id: 'Person 2 id',
                version: 'Person 2 version 2 id',
                proto: {
                    name: 'Petro',
                    description: ''
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Person 2 id',
                version: 'Person 2 version 1 id',
                proto: null,
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Person 3 id',
                version: 'Person 3 version 1 id',
                proto: null,
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }];

            repo.merge(records_ajax2);

            var searchResults = [];

            repo.descriptors.Person.properties.description.intersect('always', null, function(searchResult) {
                searchResults.push(searchResult);
            });

            expect(searchResults.length).toBe(0);
        });

        it('all functionality should work appropriately for a basic case', function () {
            var declarations = {
                Route: {
                    responsible: 'Person',
                    sourceAirport: 'Airport',
                    targetAirport: 'Airport',

                    name: 'Atom',
                    description: 'Atom'
                },
                Airport: {
                    city: 'City',

                    name: 'Atom',
                    description: 'Atom'
                },
                Person: {
                    city: 'City',

                    name: 'Atom',
                    description: 'Atom'
                },
                City: {
                    country: 'Country',

                    name: 'Atom',
                    description: 'Atom'
                },
                Country: {
                    name: 'Atom',
                    description: 'Atom'
                }
            };

            var repo = new Reflex.Repo(declarations);

            var records_ajax1 = [{
                id: 'Route 1 id',
                version: 'Route 1 version 1 id',
                proto: {
                    description: 'This is route numero uno',
                    responsible: 'Person 1 id',
                    sourceAirport: 'Airport 1 id',
                    targetAirport: 'Airport 2 id'
                },
                table: 'Route',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Airport 1 id',
                version: 'Airport 1 version 1 id',
                proto: {
                    city: 'City 1 id',

                    name: 'Airport 1',
                    description: 'Always'
                },
                table: 'Airport',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Airport 2 id',
                version: 'Airport 2 version 1 id',
                proto: {
                    city: 'City 2 id',

                    name: 'Airport 2',
                    description: 'Always'
                },
                table: 'Airport',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Person 1 id',
                version: 'Person 1 version 1 id',
                proto: {
                    city: 'City 2 id',

                    name: 'Person 1',
                    description: 'Always'
                },
                table: 'Person',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'City 1 id',
                version: 'City 1 version 1 id',
                proto: {
                    country: 'Country 1 id',

                    name: 'City 1',
                    description: 'This is city one'
                },
                table: 'City',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'City 2 id',
                version: 'City 2 version 1 id',
                proto: {
                    country: 'Country 1 id',

                    name: 'City 2',
                    description: 'This is city two always'
                },
                table: 'City',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }, {
                id: 'Country 1 id',
                version: 'Country 1 version 1 id',
                proto: {
                    name: 'Country 1',
                    description: 'This is country one always'
                },
                table: 'Country',
                permission: guid(),
                createdOn: (new Date()).getTime(),
                updatedOn: (new Date()).getTime()
            }];

            repo.merge(records_ajax1);

            var searchResults = repo.search('always', 'Airport');

            expect(searchResults.length).toBe(2);
        });
    });
});
