# typesafe-enums

This library aims to provide a safer alternative to TypeScript enums. TypeScript 3.4 introduced [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions), which are far better than traditional enums. In practice, however, there is a lot of boilerplate that ends up accompanying these. This library collects all of that boilerplate into a conventient object.

## Usage
```ts
import { createEnum } from 'typesafe-enum'

export const Example = createEnum({
  First: 'one',
  Second: 'two',
  Third: 'three',
})

// for convenience, you can export a type of the same name.
export type Example = typeof Example
```
Values can be referenced with type safety such as:
```ts
import { EnumValue } from 'typesafe-enum'

const exampleFn = (value: EnumValue<Example>) => { /* ... */ }

exampleFn(Example.First)

// literals are ok too
exampleFn('one')

// ERROR: Argument of type '"four"' is not assignable to
// parameter of type '"one" | "two" | "three"'
exampleFn('four')
```
Similarly, keys can also be referenced with type safety:
```ts
const exampleFn = (example: EnumKey<Example>) => { /* ... */ }

// ok
exampleFn('First')

// ERROR: Argument of type '"something-else"' is not assignable to
// parameter of type '"First" | "Second" | "Third"'
exampleFn('something-else')
```

## Enumerating values
typesafe enums have methods to enumerate values, and are also compatible with standard `Object` enumerable functions.
```ts
Example.keys() // returns ['First', 'Second', 'Third']
Object.keys(Example) // returns ['First', 'Second', 'Third']

Example.values() // returns ['one', 'two', 'three']
Object.values(Example) // returns ['one', 'two', 'three']
```

## Type guards
One thing that is painful with both traditional enums and const assertions is checking if a value in a variable is actually a member of the enum. Typesafe enums include type guards for both:
```ts
const someRandomValue: unknown = 'sdfsdfsdsdf'

const exampleFn = (value: EnumValue<Example>) => {
  /* ... */
}

// ERROR: Argument of type 'unknown' is not assignable to
// parameter of type '"one" | "two" | "three"'
exampleFn(someRandomValue)

if (Example.isValue(someRandomValue)) {
  exampleFn(someRandomValue)
}

const exampleFn2 = (example: EnumKey<Example>) => {
  /* ... */
}
// ERROR: Argument of type 'unknown' is not assignable to
// parameter of type '"one" | "two" | "three"'
exampleFn2(someRandomValue)

if (Example.isKey(someRandomValue)) {
  exampleFn2(someRandomValue)
}
```

## Reverse mapping
Both keys and values in a Typesafe Enums are required to be unique. Thus, reverse lookup for the key of a value is possible:
```ts
const key = Example.keyOf('one') // returns 'First'
```

## Motivation
TypeScript's enums have a lot of well known issues. Even some of the TypeScript maintainers have said as much. To be fair, the intent was to provide a finite list of constants with the expectation being that you largely ignore the "values". It's a "key only" data structure, if you will.

Fair enough, if this actually worked, but 

```ts
enum Thing {
  First,
  Second,
  Third,
}

const example = (thing: Thing) => console.log('thing', thing)

// valid!
example(9876)
```
The string versions are slightly better:
```ts
enum StringThing {
  First = 'First',
  Second = 'Second',
  Third = 'Third',
}

const example2 = (stringThing: StringThing) => {
  console.log('stringThing:', stringThing)
}

// ERROR: Argument of type '"something else"' is not
// assignable to parameter of type 'StringThing'.
example2('something else')
```

But they don't allow direct use of the resolved values:
```ts
// ERROR: Argument of type '"First"' is not
// assignable to parameter of type 'StringThing'.
example2('First')
```

And they give you no mechanism for the reverse lookup:
```ts
const getEnumValue = (str: string): StringThing => {
  // there's not a particularly good way to do this
}
```

Even if they did, you couldn't really count on it because there are no unique constraints:
```ts
// which constant should I get when looking up 'First'?
enum StringThing {
  First = 'First',
  Second = 'First',
  Third = 'First',
}
```
