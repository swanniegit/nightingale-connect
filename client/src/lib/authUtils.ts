export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function isApprovalRequiredError(error: Error): boolean {
  return /^403: .*pending approval/.test(error.message);
}