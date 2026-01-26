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

## Array Handling: FrozenArray<T>

The original limitation was that `readonly T[]` isn't assignable to `T[]`. Here's a workaround:

```typescript
type FrozenArray<T> = T[] & { readonly [K: number]: T };

function createFrozenArray<T>(items: T[]): FrozenArray<T> {
  return Object.freeze([...items]) as FrozenArray<T>;
}
```

### How It Works

1. **Intersection type**: `T[] & { readonly [K: number]: T }` gives us array methods while making index access readonly
2. **Object.freeze**: Runtime protection prevents actual mutations
3. **Type assertion**: The `as FrozenArray<T>` bridges TypeScript's structural typing gap

### Trade-offs

| Approach | Blocks `arr[0] = x` | Blocks `arr.push(x)` | Assignable to `T[]` |
|----------|---------------------|----------------------|---------------------|
| `readonly T[]` | ✅ | ✅ | ❌ |
| `FrozenArray<T>` | ✅ (compile) | ❌ (compile) / ✅ (runtime) | ✅ |

The `FrozenArray<T>` approach relies on `Object.freeze` for runtime protection against mutating methods. TypeScript can't statically block `.push()` while keeping assignability to `T[]`.

## A Note on Production Use

This solves the challenge, but I wouldn't use this pattern in real code. The whole point of marking something readonly is to prevent mutations - but this technique specifically bypasses that protection. It's a clever workaround, not a best practice.