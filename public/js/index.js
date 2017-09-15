const _bindAll = (object) => {
    for (let methodName in object) {
        if(typeof object[methodName] === 'function') {
            let funcProps = {};
            //cache properties of function
            for (let funcProp in object[methodName]) {
                funcProps[funcProp] = object[methodName][funcProp];  
            }

            object[methodName] = object[methodName].bind(object);

            for (let funcProp in funcProps) {
                object[methodName][funcProp] = funcProps[funcProp]; 
            }
        }
    }
}

const ViewModel = function() {
    _bindAll(this);
    this.sites = ko.observableArray([]);
    
    $.getJSON('/api/sites.json').then(res => {
        this.sites(res);
    });
};

ViewModel.prototype.remove = function(site) {
    if (confirm('Are you sure?')) {
        fetch(`/api/site/${site.id}`, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            this.sites.remove(site);
        }).catch(console.error);
    }
}

ko.applyBindings(new ViewModel(), $('#container')[0]);