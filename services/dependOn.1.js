
"use strict";

class DependOn {
    
    constructor() {
        this.resolver = {};
    }
    
    resolve(name) {
        return this.resolver[name] || (this.resolver[name] = Promise.defer());
    }
    
    on(dependencies, invoke) {

        if (typeof dependencies == 'string') {
            dependencies = [dependencies];
        }
        
        const self = this;
        const promise = Promise.all(dependencies.map(d =>
            self.resolve(d).promise
        ));
        
        promise.then(d => invoke(...d));
        
        return promise;
    }
    
    factory(name, dependencies, factory) {
        
        const self = this;
        this.on(dependencies, () => {}).then(d => 
            self.resolve(d).resolve(factory(...d))
        );
    }
    
}

module.exports = DependOn;