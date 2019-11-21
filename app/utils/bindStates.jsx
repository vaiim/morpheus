import autoBind from 'react-autobind';

class EventHandler {
  constructor() {
  }

  get(accessType, cb) {
    return this[accessType](cb);
  }

  normal(cb) {
    return event => cb(event.target.value);
  }

  direct(cb) {
    return event => cb(event);
  }

  checkbox(cb) {
    return event => cb(event.target.checked);
  }

  callback(cb) {
    return (err, data) => err || cb(data);
  }

  innerText(cb) {
    return event => cb(event.target.innerText);
  }
}

const handler = new EventHandler(this);

export class DataBinder {
  constructor(data, option) {
    option = Object.assign({parent:null, title:''}, option);
    this.data = data;
    this.component = option.component;
    this.parent = option.parent;
    this.title = option.title;
    this.key = option.key;
    this.modified = false;
    this.children = {};
    this.listeners = {};

    autoBind(this);
  }

  listen(title, fn) {
    if(this.listeners[title]) {
      this.listeners[title].push(fn);
    }
    else this.listeners[title] = [fn];
  }

  access(key, title) {
    title = title || this.title;
    if(!this.children[key]) {
      this.children[key] = new DataBinder(this.data[key], {parent: this, title, key});
    }
    return this.children[key];
  }

  map(fn=x=>x) {
    if(this.data.length > 0) {
      return this.data.map((item, i) => fn(this.access(i), i));
    }
    return [];
  }

  get(route) {
    if(route !== undefined) {
      return this.access(route).get();
    }
    return this.data;
  }

  getName() {
    if(this.parent) {
      const prefix = this.parent.getName();
      return (prefix? prefix + '_' : '' ) + this.key;
    }
    return this.key || '';
  }

  set(data, route) {
    if(route !== undefined) return this.access(route).set(data);
    this.data = data;
    for(const key in this.children) {
      const child = this.children[key];
      child.set(data[key]);
    }
  }

  push(data) {
    if(this.data.length !== undefined) {
      const raw = [...this.get(), data];
      this.dataChanged(raw);
    }
  }

  removeRow(index) {
    const raw = [...this.get()];
    index = index.key || index; // in case index is the node object itself
    raw.splice(index, 1);
    this.children= {}; // remove all children and render again. Can save them if performance is issue
    this.dataChanged(raw);
  }

  swapRows(index1, index2) {
    const raw = [...this.get()];
    if(index1 < 0 || index2 < 0 || index1 >= raw.length || index2 >= raw.length) return;
    raw[index1] = this.get()[index2];
    raw[index2] = this.get()[index1];
    this.dataChanged(raw);
  }

  attach(option) {
    option = option || 'normal';
    if(typeof(option) === 'string') {
      option = {
        accessType: option
      }
    }
    return handler.get(option.accessType, data => {
      data = option.pre ? option.pre(data) : data;
      this.dataChanged(data);
      option.after && option.after(data);
    });
  }

  dataChanged(data) {
    this.parent && this.parent.update({data, title: this.title, child: this});
  }

  update(protocol) {
    for(const key in this.children) {
      const child = this.children[key];
      if(child === protocol.child) {
        this.data[key] = protocol.data;
      }
    }
    protocol.data = this.data;
    if(this.parent && this.parent.update) {
      protocol.child = this;
      this.parent.update(protocol);
    }
    else {
      this.flush(protocol);
    }
  }

  flush(protocol) {
    this.data = protocol.data;
    this.component && this.component.setState(this.data);
    if(this.listeners[protocol.title]) {
      this.listeners[protocol.title].map(fn => fn(protocol));
    }
    if(this.data) {
      for(const key in this.children) {
        this.children[key].flush({...protocol, data: this.data[key]});
      }      
    }
    else {
      this.children = [];
    }
  }
}