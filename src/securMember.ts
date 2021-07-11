import { UserDetails } from "@tsalliance/sdk";
import { ApiError } from "@tsalliance/sdk";

export class SecurRole {
  public uuid: string;
  public rolename: string;
  public permissions: string[];
  public hierarchy: number;
}

export class SecurMember implements UserDetails {
  public uuid: string;
  public username: string;
  public email: string;
  public role: SecurRole;

  public isAuthenticated: boolean;
  public authenticationError?: ApiError;
  public roleId: string;

  constructor(member: SecurMember) {
    this.uuid = member.uuid;
    this.username = member.username;
    this.email = member.email;
    this.roleId = member.roleId;
    this.role = member.role;
  }

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

  public getHierarchy(): number {
    return this.role?.hierarchy;
  }
}
