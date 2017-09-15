const SiteData = window.SiteData || {};

const DEFAULT_VALUES = {
  id: SiteData.id || null,
  flags: 'azv',
  exclude: [
    '.idea/',
    '.git/',
    'cache/*'
  ],
  options: [
    {name: 'no-perms', value: ''},
    {name: 'delete', value: ''},
    {name: 'no-owner', value: ''},
    {name: 'no-group', value: ''}
  ]
};

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

const _interval = (fn, time) => {
  let executedLeastOnce = false;
  let timeout, that, thatArguments;
  let lastExuctionTime = Date.now();

  function deferrCall() {
      clearTimeout(timeout);

      timeout = setTimeout(function(){
          f.apply(that, thatArguments);
      }, time);
  }
  
  function f() {
      that = this;
      thatArguments = Array.prototype.slice.call(arguments);

      let now = Date.now();
      if((now - lastExuctionTime) > time || !executedLeastOnce) {
          lastExuctionTime = now;
          executedLeastOnce = true;
          fn.apply(that, thatArguments);
      } else {
          deferrCall();
      }
  }

  f.force = function() {
      clearTimeout(timeout);
      fn.apply(that, thatArguments); 
  };

  return f;
};

const _buildOptions = function(options) {
  let optionsModels = [];
  options.forEach((option) => {
    optionsModels.push({
          name: ko.observable(option.name),
          value: ko.observable(option.value)
      })
  });

  this.options(optionsModels);
};

const _buildExclude = function(excludes) {
  let excludeObservables = excludes.map((exclude) => {
    return { value: ko.observable(exclude) };
  });
  
  this.exclude(excludeObservables); 
}

const SiteModel = function(site) {
  _bindAll(this);
  
  this.id = site.id || null;
  this.name = ko.observable();
  this.destination = ko.observable();
  this.source = ko.observable();
  this.flags = ko.observable();
  this.port = ko.observable();
  this.options = ko.observableArray([]);
  this.exclude = ko.observableArray([]);

  this.setValues(site);
}

SiteModel.prototype.setValues = function(site) {
  this.id = site.id || null;
  this.name(site.name);
  this.destination(site.destination);
  this.source(site.source);
  this.port(site.port);
  this.flags(site.flags);
  _buildOptions.call(this, site.options || []);
  _buildExclude.call(this, site.exclude || []);
}

SiteModel.prototype.toPlainObject = function() {
  let site = {
      id: this.id,
      name: this.name(),
      destination: this.destination(),
      source: this.source(),
      flags: this.flags(),
      port: this.port(),
      exclude: this.exclude().map(exclude => {
        return exclude.value()
      }),
      options: this.options().map(option => {
          return {
              name: option.name(),
              value: option.value()
          }
      })
  };
  
  return site;
};

const ViewModel = function(site) {
  _bindAll(this);

  this.site = new SiteModel(site);
  this.proccessing = ko.observable(false);
  this.result = ko.observable('');
  this._incomingMessage = '';

  if (this.site.id) {
    $.getJSON(`/api/site/${this.site.id}`).then(res => {
        this.site.setValues(res);
    });
  }
};

ViewModel.prototype.addOption = function() {
  this.site.options.push({
      name: ko.observable(),
      value: ko.observable()
  });
}

ViewModel.prototype.removeOption = function(option) {
  this.site.options.remove(option);
}

ViewModel.prototype.addExclude = function() {
  this.site.exclude.push({value: ko.observable('')});
}

ViewModel.prototype.removeExclude = function(exclude) {
  this.site.exclude.remove(exclude);
}

ViewModel.prototype.reverse = function() {
  let source = this.site.source();
  this.site.source(this.site.destination());
  this.site.destination(source);
}

ViewModel.prototype.execute = function(site) {
  if (this.proccessing()) {
      return;
  }

  this._incomingMessage = '';
  this.proccessing(true);
  this.result('');

  const socket = new WebSocket("ws://localhost:8081");
  
  socket.onopen = () => {
      console.log("Connected");
      socket.send(JSON.stringify(this.site.toPlainObject()));
  };

  socket.onclose = () => {
      console.log("Connection closed");
      this.proccessing(false);
      this.appendIncomingMessageToResult.force();
  };
  
  socket.onmessage = (event) => {
      this._incomingMessage += event.data;
      this.appendIncomingMessageToResult();
  };
};

ViewModel.prototype.appendIncomingMessageToResult = _interval(function() {
  this.result(this.result() + "\n"+ this._incomingMessage);
  this._incomingMessage = '';
}, 5000);

ViewModel.prototype.save = function() {
  fetch('/api/site/save', {
    method: 'post',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.site.toPlainObject())
  }).then(res => {
    return res.json();
  }).then(data => {
    this.site.setValues(data);
  }).catch(console.error);
};

ko.applyBindings(new ViewModel(DEFAULT_VALUES), $('#container')[0]);