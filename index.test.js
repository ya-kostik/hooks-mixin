/*global test expect jest */
const HooksMixin = require('./');

function mockClassInstance() {
  const Class = function() {};
  HooksMixin(Class);
  return new Class();
}

test('Add hooks ability to Class', () => {
  const instance = mockClassInstance();
  expect(instance).toHaveProperty('hook');
  expect(instance).toHaveProperty('removeHook');
  expect(instance).toHaveProperty('__processHooks');
  expect(instance).toHaveProperty('__processHooksAsync');
  expect(instance).not.toHaveProperty('__hooks');
  instance.hook('test', () => {});
  expect(instance).toHaveProperty('__hooks');
  expect(instance).toHaveProperty('__hooks.test');
  expect(instance.__hooks.test).toHaveLength(1);
});

test('Call hooks', () => {
  const instance = mockClassInstance();
  const mockHook = jest.fn();
  instance.hook('test', mockHook);
  instance.hook('test', mockHook);
  instance.__processHooks('test');
  expect(mockHook).toHaveBeenCalledTimes(2);
});

test('Call hooks with arguments', () => {
  const instance = mockClassInstance();
  let called = false;
  instance.hook('test', (a, b, c, self) => {
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(c).toBe(3);
    expect(self).toBe(instance);
    called = true;
  });
  instance.__processHooks('test', 1, 2, 3);
  expect(called).toBe(true);
});

test('Call hooks without arguments', () => {
  const instance = mockClassInstance();
  let called = false;
  instance.hook('test', (self) => {
    expect(self).toBe(instance);
    called = true;
  });
  instance.__processHooks('test');
  expect(called).toBe(true);
});

test('Remove hook', () => {
  const instance = mockClassInstance();
  const hook = () => {};
  instance.hook('test', hook);
  expect(instance.__hooks.test[0]).toBe(hook);
  instance.removeHook('test', hook);
  expect(instance.__hooks.test[0]).toBe(undefined);
  const hook2 = () => {};
  instance.hook('test', hook);
  instance.hook('test', hook2);
  instance.removeHook('test', hook);
  expect(instance.__hooks.test[0]).toBe(hook2);
});

test('Async hooks call', async () => {
  const instance = mockClassInstance();
  let called = 0;
  let done = false;
  const hook = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        called += 1;
        resolve();
      }, 10);
    });
  };
  const TIMES = 4;
  for (let i = 0; i < TIMES; i++) {
    instance.hook('test', hook);
  }
  instance.test = async function() {
    await this.__processHooksAsync('test');
    expect(called).toBe(TIMES);
    done = true;
  }
  await instance.test();
  expect(done).toBe(true);
});
