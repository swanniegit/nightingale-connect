import { DatabaseError } from '@/types'

// CATEGORY: Core Libs/Types
// CONTEXT: Shared

export class DatabaseOperationError extends Error implements DatabaseError {
  code?: string
  constraint?: string
  
  constructor(message: string, code?: string, constraint?: string) {
    super(message)
    this.name = 'DatabaseOperationError'
    this.code = code
    this.constraint = constraint
  }
}

export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseOperationError) {
    return error
  }
  
  if (error instanceof Error) {
    return new DatabaseOperationError(error.message)
  }
  
  return new DatabaseOperationError('Unknown database error')
}

export function isRetryableError(error: DatabaseError): boolean {
  const retryableCodes = ['QuotaExceededError', 'TransactionInactiveError']
  return retryableCodes.includes(error.code || '')
}

export function getErrorMessage(error: DatabaseError): string {
  switch (error.code) {
    case 'QuotaExceededError':
      return 'Storage quota exceeded. Please free up space.'
    case 'TransactionInactiveError':
      return 'Database transaction failed. Please try again.'
    case 'ConstraintError':
      return 'Data constraint violation. Please check your input.'
    default:
      return error.message || 'Database operation failed'
  }
}
