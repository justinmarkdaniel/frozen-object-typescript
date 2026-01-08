// ===========================================
// FrozenObject<T> - Tests
// ===========================================
// This file demonstrates compile-time errors for mutations
// AND documents the array limitation.

type FrozenObject<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : FrozenObject<T[K]>
    : T[K];
};

// ===========================================
// TEST: Mutations are blocked (all 3 should error)
// ===========================================

interface User {
  name: string;
  address: {
    city: string;
    coordinates: {
      lat: number;
    };
  };
}

const frozen: FrozenObject<User> = {
  name: "Alice",
  address: {
    city: "NYC",
    coordinates: { lat: 40.7 },
  },
};

// These lines SHOULD produce compile-time errors:
frozen.name = "Bob";                    // Level 1: direct property
frozen.address.city = "LA";             // Level 2: nested property
frozen.address.coordinates.lat = 0;     // Level 3: deeply nested property

// ===========================================
// KNOWN LIMITATION: Arrays
// ===========================================
// The solution works for objects but NOT arrays.
// TypeScript treats `readonly T[]` as incompatible with `T[]`
// because arrays have mutating methods (push, pop, etc).
//
// Example that would fail:
//
//   interface WithArray { items: string[] }
//   const frozen: FrozenObject<WithArray> = { items: ["a"] };
//   function mutate(obj: WithArray) { obj.items.push("b"); }
//   mutate(frozen);  // ❌ Error: readonly string[] not assignable to string[]
//
// This is a fundamental TypeScript limitation, not a solution flaw.

export {};