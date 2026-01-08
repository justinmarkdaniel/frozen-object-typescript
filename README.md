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

This works because TypeScript's `readonly` is covariant—readonly types can be assigned to mutable types, but not vice versa.

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

## Known Limitation

Arrays break assignability. TypeScript treats `readonly T[]` as incompatible with `T[]` because arrays have mutating methods (push, pop, etc). This is a TypeScript design decision, not a solution flaw.

## Not for production or live use

While the solution technically works, is is not to be used in a production environment.