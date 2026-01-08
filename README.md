# FrozenObject<T> Challenge

## The Challenge

Design a generic type `FrozenObject<T>` that:

1. Makes all properties of T deeply readonly (compile-time error on reassignment)
2. Remains assignable to mutable T without casts or cloning
3. Uses a single consistent type (no unions, overloads, or conditional branches)

## The Solution

```typescript
type FrozenObject<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : FrozenObject<T[K]>
    : T[K];
};
```

This works because TypeScript lets you assign readonly values into mutable spots (called "covariance"). The reverse isn't allowed.

## Files

| File | Purpose |
|------|---------|
| `solution.ts` | Solution + proof it compiles when assigned to mutable T |
| `tests.ts` | Proves mutations are blocked at all nesting levels |
| `test.sh` | Runs both tests and displays results |

## Usage

```bash
npm install typescript   # if not installed
./test.sh
```

## Known Limitation: Arrays

Arrays don't work with this approach. TypeScript treats `readonly T[]` as incompatible with `T[]` because arrays have mutating methods like push() and pop(). This is just how TypeScript handles arrays - not something we can work around.

## A Note on Production Use

This solves the challenge, but I wouldn't use this pattern in real code. The whole point of marking something readonly is to prevent mutations - but this technique specifically bypasses that protection. It's a clever workaround, not a best practice.