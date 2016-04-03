
'use strict';

class EasyDb {
    
    constructor(nedb) {
        this.nedb = nedb;
        this.nedb.ensureIndex({ fieldName: '_id', unique: true });
        this.nedb.persistence.setAutocompactionInterval(3600000);
    }
    
    get(id, defaultValue) {
        
        const deferred = Promise.defer();
        
        this.nedb.findOne({ _id: id }, (error, document) =>
           deferred.resolve((document && document.item) || defaultValue)
        );
        
        return deferred.promise;
    }
    
    set(id, item) {
        
        this.nedb.update({ _id: id }, { $set: { item: item } }, { upsert: true });
    }   
}

depend.factory(
    'easyDb', 
    ['nedb'], 
    nedb => new EasyDb(nedb)
);