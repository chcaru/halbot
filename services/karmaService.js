
'use strict';

class KarmaService {
    
    constructor(easyDb, nedb) {
        this.easyDb = easyDb;
        this.nedb = nedb;
    }
    
    getKarma(userId) {
        
        return this.easyDb.get(userId + '-karma', 0);
    }
    
    changeKarma(userId, count) {
        
        this.getKarma(userId).then(userKarmaPoints => {
            
            userKarmaPoints += count;
            this.easyDb.set(userId + '-karma', userKarmaPoints);
        });
    }
    
    topUsers(maxCount) {
        
        return new Promise(resolve => 
            this.nedb.find({ _id: /-karma/ }, (err, docs) => 
                resolve(docs
                    .sort((a,b) => a.item <= b.item)
                    .slice(0, maxCount)
                    .map(i => ({
                        name: i._id,
                        karma: i.item
                    }))
                )
            )
        );
    }
}

depend.factory(
    'karmaService',
    ['easyDb', 'nedb'],
    (easyDb, nedb) => new KarmaService(easyDb, nedb)
);