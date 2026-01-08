// ===========================================
// FrozenObject<T> - Tests
// ===========================================
// NOTE: This file should NOT compile successfully.
// Run `npx tsc tests.ts` and you should see 3 errors.
//
// This file is intentionally broken - it contains mutations that
// TypeScript should reject. If this compiles, something's wrong!

type FrozenObject<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : FrozenObject<T[K]>
    : T[K];
};

// ===========================================
// TEST: Mutations are blocked
// ===========================================
// These assignments should all fail to compile.
// We're testing that readonly works at every nesting level.

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

// All three of these should show red squiggles in your editor:
frozen.name = "Bob";                    // top-level property
frozen.address.city = "LA";             // one level deep
frozen.address.coordinates.lat = 0;     // two levels deep

// ===========================================
// KNOWN LIMITATION: Arrays
// ===========================================
// The solution works for objects but NOT arrays.
// TypeScript won't let us assign a readonly array to a mutable one
// because arrays have methods like push() and pop() that would mutate.
//
// Here's what happens if you try to use arrays:
//
//   interface WithArray { items: string[] }
//   const frozen: FrozenObject<WithArray> = { items: ["a"] };
//   function mutate(obj: WithArray) { obj.items.push("b"); }
//   mutate(frozen);  // Error: readonly string[] not assignable to string[]
//
// This is just how TypeScript handles arrays - not something we can work around.

export {};