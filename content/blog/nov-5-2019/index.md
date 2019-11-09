---
title: "Python - What are *args & **kwargs?"
date: "2019-11-05T23:29:57.241Z"
description: "Python notes admist a sprint of mostly backend work."
tags: [code, python, args, kwargs, django, class]
---

A year ago, while I was still a fulltime receptionist and private barista, I started teaching myself React, and learning JavaScript as a side effect. Now as a frontend engineer, I'm learning Django to understand my workplace's backend, and similar to before, I'm learning Python as a side effect.

Finding time and energy to write about topics that I'm learning (or want to learn) is growing more and more difficult. It's happened a few times now where I quickly "learn" some piece of tech (like Cypress, or some Django shell commands) in order to satisfy/complete _some ticket_ within a sprint. But when the new day comes around, I essentially "unlearn" what I learned the day before.

That should probably be fixed.

## Example function

How I go about trying to figure out some language feature is typically to google it, and then put it in a [repl.it](repl.it) or [codesandbox.io](codesandbox.io) so that I can start moving pieces around and see _what is what_.

```python
def doStuff(arg, *args, **kwargs):

    print("arg:", arg, type(arg))

    print(f'args: {args} | Type: {type(args)}')
    for arg in args:
        print("args", arg,)

    print(f'kwargs: {kwargs} | Type: {type(kwargs)}')
    for arg in kwargs:
        print(f'{arg}: {kwargs[arg]}')
```

The Output of `doStuff(4, 1, foo="foo", agh=9)`

```
arg: 4 <class 'int'>
args: (1,) | Type: <class 'tuple'>
args 1
kwargs: {'foo': 'foo', 'agh': 9} | Type: <class 'dict'>
foo: foo
agh: 9
```

Pretty self explanitory as to what's going on here.

### \*args

_"It is used to pass a non-keyworded, variable-length argument list."_
~ [geeks for geeks](https://www.geeksforgeeks.org/args-kwargs-python/)

In short, `*args` is everything other than your explicitly declared function arguments/parameters, and any keyworded parameters. It's like JavaScript's [arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) object.

- type 'tuple'

### \*\*kwargs

Coming from JavaScript, this is foreign to me, but not exactly. It's kind of like when you pass an object as an argument to a function. The values need specific key words.

```js
// JavaScript
const fn = ({keyOne, keyTwo}) => {
  console.log(keyOne)
  console.log(keyTwo)
}

fn({keyOne: "Hello,", keyTwo: "World!})
```

```python
# Python
def fn(**kwargs):
    for key, value in kwargs.items():
        # TODO: what do you call these two?
        print ("%s == %s" %(key, value))
        # and this
        print("The value of {} is {}".format(key, value))

fn(keyOne="Hello,", keyTwo="World!")
```

- type 'dict'
