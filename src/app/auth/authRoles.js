/**
 * Authorization Roles
 */
const authRoles = {
  admin: ["guest"],
  staff: ["admin", "support"],
  user: ["admin", "support", "customer"],
  onlyGuest: ["guest"]
};

export default authRoles;
