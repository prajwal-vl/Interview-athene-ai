// buggy_generics.ts - CORRECTED VERSION

type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

class ApiClient {
  async get<T>(url: string): Promise<Result<T>> {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    const data = await response.json()
    return { success: true, data }
  }

  processResult<T>(result: Result<T>, fallback: T): T {
    if (result.success) {
      return result.data
    }
    return fallback
  }

  // Bug fix #1 & #2: properly handle error cases with type narrowing
  mergeResults<T, U>(a: Result<T>, b: Result<U>): Result<T & U> {
    // Both must succeed to merge
    if (a.success && b.success) {
      return { success: true, data: { ...a.data, ...b.data } }
    }
    
    // Bug fix #3: return proper error union type
    if (!a.success) {
      return { success: false, error: a.error } as Result<T & U>
    }
    return { success: false, error: b.error } as Result<T & U>
  }
  
  // Bug fix #4: SAFE helper to access merged data
  safeAccess<T, U>(merged: Result<T & U>): void {
    if (merged.success) {
      console.log(merged.data.id)    // ✅ Safe
      console.log(merged.data.name)  // ✅ Safe
    } else {
      console.log(`Error: ${merged.error}`)
    }
  }
}

// Simulated usage
const client = new ApiClient()
const res1: Result<{ id: number }> = { success: true, data: { id: 5 } }
const res2: Result<{ name: string }> = { success: false, error: "missing" }
const merged = client.mergeResults(res1, res2)

// Bug fix: check success before accessing
if (merged.success) {
  console.log(merged.data.id)
  console.log(merged.data.name)
} else {
  console.log(`Failed to merge: ${merged.error}`)
}