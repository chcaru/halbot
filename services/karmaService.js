
"use strict";

class KarmaService {
    
    constructor(easyDb) {
        this.easyDb = easyDb;
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
}

depend.factory(
    'karmaService',
    ['easyDb'],
    easyDb => new KarmaService(easyDb)
);