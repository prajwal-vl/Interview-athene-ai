// buggy_promise.ts - CORRECTED VERSION

interface ApiResponse {
  data: string | null
  status: number
}

const fetchUser = (id: number): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ data: `User ${id}`, status: 200 })
      } else {
        resolve({ data: null, status: 404 })
      }
    }, Math.random() * 100)
  })
}

// Bug fix #1 & #2: await inside loop + proper Promise.all for concurrency
const fetchAllUsers = async (ids: number[]): Promise<string[]> => {
  // Better approach: use Promise.all for parallel execution
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetchUser(id) // Bug fix: added await
      return res.data
    })
  )
  
  // Bug fix #3: filter out null values
  return results.filter((data): data is string => data !== null)
}

// Alternative correct version (if sequential is desired):
/*
const fetchAllUsersSequential = async (ids: number[]): Promise<string[]> => {
  const results: string[] = []
  for (const id of ids) {
    const res = await fetchUser(id)  // MUST await here
    if (res.data) results.push(res.data)
  }
  return results
}
*/

fetchAllUsers([1, 2]).then(console.log) // Output: ["User 1", "User 2"]