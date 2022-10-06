export default {
  delegatedAccountIds: ['account1', 'account2'],
  delegatedRoles: [
    {
      name: "Admin",
      policyNames: ["AdministratorAccess"],
    },
    {
      name: "Billing",
      policyNames: ["Billing"],
    },
    {
      name: "ReadOnly",
      policyNames: ["ReadOnlyAccess"],
    },
  ]
};
