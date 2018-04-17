# hooks-mixin
A small mixin for classes. Adds hooks ability to your classes

## Install

### Yarn
```
yarn add hooks-mixin
```

### NPM
```
npm i hooks-mixin
```

## Use
### Add and call
```javascript
const HooksMixin = require('hooks-mixin');

class Class {
  async save() {
    // sync hook call
    this.processHooks('pre-save');
    await this.write();
    // async hook call
    await this.processHooksAsync('saved');
    return this;
  }
};

HooksMixin(Class);

const instance = new Class();
// add hook
instance.hook('pre-save', (instance) => {
  // instance — is an instance this
  // things with instance
});
instance.save();
// will call pre-save and saved hooks
```

You can add many hooks:
```javascript
instance.hook('pre-save', () => console.info('One'));
instance.hook('pre-save', () => console.info('Two'));
instance.hook('saved', () => console.info('Three'));
instance.hook('saved', () => console.info('Four'));

instance.save();
// One, Two, Three, Four
```

### Remove hook callback
```javascript
const preSaveHookFunction = () => console.info('=)');
instance.hook('pre-save', preSaveHookFunction);

instance.save();
// =)
instance.removeHook('pre-save', preSaveHookFunction);
instance.save();
// no “=)”
```

## Frontend

Just `import` or `require` from `build/index.js`.
