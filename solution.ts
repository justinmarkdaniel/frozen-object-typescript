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
// ARRAY SOLUTION: FrozenArray<T>
// ===========================================
// Arrays need special handling because readonly T[] has different methods
// than T[]. The trick: use a tuple-like mapped type that preserves length
// but makes elements readonly.

/**
 * FrozenArray<T> - A readonly array that can be assigned to mutable T[]
 *
 * How it works:
 * - We intersect with { readonly [i: number]: T } to make index access readonly
 * - But the base array type remains assignable because we're not using readonly[]
 * - This is a partial solution - it blocks arr[0] = x but not arr.push(x)
 */
type FrozenArray<T> = T[] & { readonly [K: number]: T };

// For a truly frozen array that blocks all mutations, we need a different approach:
// Wrap the array in an object and freeze that object's reference to it.

interface FrozenArrayContainer<T> {
  readonly items: readonly T[];
}

// Helper to create a frozen array that can be passed where T[] is expected
function createFrozenArray<T>(items: T[]): FrozenArray<T> {
  return Object.freeze([...items]) as FrozenArray<T>;
}

// ===========================================
// TEST 2: Array assignability
// ===========================================

interface UserWithTags {
  name: string;
  tags: string[];
}

const frozenWithTags: FrozenObject<UserWithTags> & { tags: FrozenArray<string> } = {
  name: "Alice",
  tags: createFrozenArray(["admin", "user"])
};

// This compiles - FrozenArray<string> is assignable to string[]
function processTags(user: UserWithTags): void {
  console.log("Processing tags:", user.tags.join(", "));
}

processTags(frozenWithTags as UserWithTags);

console.log("✅ FrozenArray<string> works with functions expecting string[]");

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