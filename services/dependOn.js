
'use strict';

class DependOn {
    
    constructor() {
        this.resolver = {};
    }
    
    on(dependencies, invoke) {

        if (typeof dependencies === 'string') {
            dependencies = [dependencies];
        }
        
        const promise = Promise.all(dependencies.map(d => (this.resolver[d] || (this.resolver[d] = Promise.defer())).promise));
        
        promise.then(d => invoke(...d));
        
        return promise;
    }
    
    factory(name, dependencies, factory) {
        
        this.on(dependencies, () => {}).then(d => 
            (this.resolver[name] || (this.resolver[name] = Promise.defer())).resolve(factory(...d))
        );
    }
    
}

module.exports = DependOn;