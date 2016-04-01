
"use strict";

class EasyDb {
    
    constructor(nedb) {
        this.nedb = nedb;
        this.nedb.ensureIndex({ fieldName: '_id', unique: true });
    }
    
    get(id, defaultValue) {
        
        const deferred = Promise.defer();
        
        this.nedb.findOne({ _id: id }, (error, document) => {
           
           deferred.resolve((document && document.item) || defaultValue);
           
        });
        
        return deferred.promise;
    }
    
    set(id, item) {
        
        this.nedb.findOne({ _id: id }, (error, document) => {
           
           if (document) {
               
               this.nedb.update({ _id: id }, { $set: { item: item } }, {});
           }
           else {
               
               this.nedb.insert({ _id: id, item: item });
           }
        });
    }   
}

depend.factory(
    'easyDb', 
    ['nedb'], 
    nedb => new EasyDb(nedb)
);