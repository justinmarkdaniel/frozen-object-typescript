// ===========================================
// FrozenObject<T> - Solution
// ===========================================
// PROOF: FrozenObject<T> is directly assignable to mutable T
// No casting. No cloning. No cheating.

type FrozenObject<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : FrozenObject<T[K]>
    : T[K];
};

// ===========================================
// TEST 1: Assignable to mutable T (objects)
// ===========================================

interface User {
  name: string;
  address: { city: string };
}

const frozen: FrozenObject<User> = {
  name: "Alice",
  address: { city: "NYC" }
};

// Function expects MUTABLE User and actually mutates it
function mutate(u: User): void {
  u.name = "Bob";  // <-- actual mutation
  console.log("Mutated name to:", u.name);
}

// DIRECT PASS - no `as User`, no JSON.parse clone
mutate(frozen);

// Direct variable assignment - also no cast
const mutableRef: User = frozen;

console.log("✅ FrozenObject<User> passed directly to function expecting mutable User");
console.log("✅ FrozenObject<User> assigned directly to User variable (no cast)");

// ===========================================
// KNOWN LIMITATION: Arrays
// ===========================================
// TypeScript treats `readonly T[]` as structurally incompatible with `T[]`
// because arrays have mutating methods (push, pop, etc).
//
// This is a fundamental TypeScript limitation.

// ===========================================
// PRODUCTION NOTE
// ===========================================
// This solution works because TypeScript's readonly is covariant - readonly
// types can flow into mutable contexts.
//
// However, this pattern should be avoided in production. If we freeze an
// object, we're signaling "this shouldn't be mutated." But this solution
// lets us pass it to functions that will mutate it - TypeScript won't catch
// that bug. The compiler allows it, but at runtime you're mutating data the
// caller assumed was immutable.
//
// In a real codebase, its better to enforce types throughout the type system rather than
// working around them.

export {};