export class SecurRole {
  public uuid: string;
  public rolename: string;
  public permissions: string[];
  public hierarchy: number;
}

export class SecurMember {
  public uuid: string;
  public username: string;
  public email: string;
  public role: SecurRole;

  /**
   * Check if member has a permission
   * @param permission Permission to check
   * @returns True or False
   */
  public hasPermission(permission: string): boolean {
    if (!this.role) return false;

    return (
      this.role.permissions.includes("*") ||
      this.role.permissions.includes(permission)
    );
  }
}
