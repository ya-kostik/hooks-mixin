/**
 * Add hook to Class
 * @param  {String}   name hook's name
 * @param  {Function} fn   hook's callback
 */
function hook(name, fn) {
  if (!(name && typeof name === 'string')) {
    throw new TypeError('name should be non empty string');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn is not a function');
  }
  if (!this.__hooks) this.__hooks = {};
  if (!this.__hooks[name]) this.__hooks[name] = [];
  this.__hooks[name].push(fn);
}

/**
* get hooks of context
* @param  {Object} context
* @param  {String} name hook's name
* @return {Array}  array of hook's callbacks
*/
function getHooks(context, name) {
  if (!(context.__hooks && context.__hooks[name])) return null;
  return context.__hooks[name];
}

/**
* remove hook by name and callback
* @param  {String}   name hook's name
* @param  {Function} fn   hook's callback
* @return {Function|null} hook's callback or null, if hook not found
*/
function removeHook(name, fn) {
  const hooks = getHooks(this, name);
  if (!hooks) return null;
  const index = hooks.indexOf(fn);
  if (index === -1) return null;
  hooks.splice(index, 1);
  return fn;
}

/**
 * get hook arguments
 * @param  {Object} context
 * @param  {Object} arguments
 * @return {Array}  next arguments
 */
function getHookArguments(context, argsIn) {
  const args = Array.from(argsIn);
  args.shift();
  args.push(context);
  return args;
}

/**
 * process hooks by name
 * @param  {String}   name hook's name
 */
function processHooks(name) {
  const hooks = getHooks(this, name);
  if (!hooks) return;
  const args = getHookArguments(this, arguments);
  for (const hook of hooks) {
    hook.apply(null, args);
  }
}

/**
 * process hooks by name (“parallel” with Promise.all)
 * @param  {String} name
 * @return {Promise}
 */
function processHooksAsync(name) {
  const hooks = getHooks(this, name);
  if (!hooks) return;
  const args = getHookArguments(this, arguments);
  return Promise.all(hooks.map((hook) => {
    return hook.apply(null, args)
  }));
}

/**
 * Apply hooks' methods to Class
 * @param       {Function} Class constructor
 */
module.exports = function HooksMixin(Class) {
  Class.prototype.hook = hook;
  Class.prototype.removeHook = removeHook;
  Class.prototype.processHooks = processHooks;
  Class.prototype.processHooksAsync = processHooksAsync;
  return Class;
};
