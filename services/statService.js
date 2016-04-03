
'use strict';

const messageCountSuffix = '-messageCount';
const reactionCountSuffix = '-reactionCount';

class StatService {
    
    constructor(easyDb, nedb) {
        this.easyDb = easyDb;
        this.nedb = nedb;
    }
    
    addMessage(userId) {
        
        this.getUserMessageStats(userId).then(messageCount => 
            this.easyDb.set(userId + messageCountSuffix, ++messageCount)
        );
    }
    
    addReaction(userId) {
        
        this.getUserReactionStats(userId).then(reactionCount => 
            this.easyDb.set(userId + reactionCountSuffix, ++reactionCount)
        );
    }
    
    getUserMessageStats(userId) {
        
        return this.easyDb.get(userId + messageCountSuffix, 0);
    }
    
    getUserReactionStats(userId) {
        
        return this.easyDb.get(userId + reactionCountSuffix, 0);
    }
    
    topMessageUsers(maxCount) {
        
        return this.topUsers(maxCount, new RegExp(messageCountSuffix));
    }
    
    topReactionUsers(maxCount) {
        
        return this.topUsers(maxCount, new RegExp(reactionCountSuffix));
    }
    
    topUsers(maxCount, match) {
        
        return new Promise(resolve => 
            this.nedb.find({ _id: match }, (err, docs) => 
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
    'statService',
    ['easyDb', 'nedb'],
    (easyDb, nedb) => new StatService(easyDb, nedb)
);