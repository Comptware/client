export function canAccessOps(role: string) {
  return role === "ADMIN" || role === "OPERATIONS";
}
