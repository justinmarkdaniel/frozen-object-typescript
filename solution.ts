// ===========================================
// FrozenObject<T> - Solution
// ===========================================
// Quick demo that FrozenObject<T> can be passed directly to functions expecting mutable T.
// No type casts, no cloning tricks - just straight assignment.

/**
 * FrozenObject<T> - Makes all properties deeply readonly.
 *
 * How it works:
 * - For each property in T, we add 'readonly'
 * - If the property is an object (but not a function), we recurse
 * - Functions are left alone so methods still work
 */
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

// This function expects a regular (mutable) User and will modify it
function mutate(u: User): void {
  u.name = "Bob";  // modifies the object
  console.log("Mutated name to:", u.name);
}

// We can pass our frozen object directly - no type casting needed
mutate(frozen);

// Direct variable assignment - also no cast
const mutableRef: User = frozen;

console.log("✅ FrozenObject<User> passed directly to function expecting mutable User");
console.log("✅ FrozenObject<User> assigned directly to User variable (no cast)");

// ===========================================
// KNOWN LIMITATION: Arrays
// ===========================================
// TypeScript won't let us assign a readonly array to a mutable one
// because arrays have methods like push() and pop() that would mutate.
// This is just how TypeScript works - nothing we can do about it.

// ===========================================
// PRODUCTION NOTE
// ===========================================
// Why does this work? TypeScript allows readonly properties to be
// assigned to mutable ones (this is called "covariance" in type theory).
//
// However, this pattern should be avoided in production. If we freeze an
// object, we're signaling "this shouldn't be mutated." But this solution
// lets us pass it to functions that will mutate it - TypeScript won't catch
// that bug. The compiler allows it, but at runtime you're mutating data the
// caller assumed was immutable.
//
// In a real codebase, it's better to enforce immutability throughout the
// type system rather than working around it.

export {};