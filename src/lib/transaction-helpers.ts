import { dbp } from './database'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export async function withTransaction<T>(
  stores: string[],
  operation: (tx: any) => Promise<T>
): Promise<T> {
  const db = await dbp
  const tx = db.transaction(stores, 'readwrite')
  try {
    const result = await operation(tx)
    await tx.done
    return result
  } catch (error) {
    tx.abort()
    throw error
  }
}

export async function withReadTransaction<T>(
  stores: string[],
  operation: (tx: any) => Promise<T>
): Promise<T> {
  const db = await dbp
  const tx = db.transaction(stores, 'readonly')
  try {
    const result = await operation(tx)
    await tx.done
    return result
  } catch (error) {
    tx.abort()
    throw error
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      if (attempt === maxRetries) break
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError!
}
