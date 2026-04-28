// buggy_basic.ts - CORRECTED VERSION

interface User {
  id: number
  name: string
  email?: string
}

const getUserName = (user: User): string => {
  // Bug fix #2: user.name could be undefined, but interface says string
  // Fix: ensure name exists or provide fallback
  return user.name.toUpperCase() // Fixed: removed ?. which returned undefined
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob", email: "bob@test.com" }, // Bug fix #1: added missing comma
  { id: 3, name: "Unknown" } // Bug fix #3: null → "Unknown" (or could use string | null)
]

// Bug fix #4: filter was checking id !== null (always true)
// Intended: filter out users with missing names? Fixed to filter valid users
const activeUsers = users.filter(u => u.name !== undefined && u.name.length > 0)

console.log(getUserName(users[0]))