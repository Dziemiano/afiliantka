"use client";

import { useState, useEffect } from "react";
import { sendInvitation } from "../actions";
import {
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser,
  getRoles,
  debugDatabaseState,
  assignOnboardRoleToUsersWithoutRoles,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserWithRoles, Role } from "@/types/role";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assigningOnboard, setAssigningOnboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First run debug to see what's in the database
        const debugInfo = await debugDatabaseState();
        console.log("Debug info:", debugInfo);

        const [usersData, rolesData] = await Promise.all([
          getUsersWithRoles(),
          getRoles(),
        ]);

        console.log("Users data:", usersData);
        console.log("Roles data:", rolesData);

        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await sendInvitation(email);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(`Invitation sent to ${email}.`);
      setEmail("");
    }
    setIsLoading(false);
  };

  const handleAssignRole = async (userId: string, roleName: string) => {
    try {
      const result = await assignRoleToUser(userId, roleName);

      if (result.success) {
        // Refresh users list
        const usersData = await getUsersWithRoles();
        setUsers(usersData);
      } else {
        console.error("Error assigning role:", result.error);
      }
    } catch (err) {
      console.error("Error assigning role:", err);
    }
  };

  const handleRemoveRole = async (userId: string, roleName: string) => {
    try {
      const result = await removeRoleFromUser(userId, roleName);

      if (result.success) {
        // Refresh users list
        const usersData = await getUsersWithRoles();
        setUsers(usersData);
      } else {
        console.error("Error removing role:", result.error);
      }
    } catch (err) {
      console.error("Error removing role:", err);
    }
  };

  const handleAssignOnboardToAll = async () => {
    setAssigningOnboard(true);
    try {
      const result = await assignOnboardRoleToUsersWithoutRoles();

      if (result.success) {
        alert(`Successfully assigned onboard role to ${result.assigned} users`);
        // Refresh users list
        const usersData = await getUsersWithRoles();
        setUsers(usersData);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error assigning onboard roles:", err);
      alert("Error assigning onboard roles");
    } finally {
      setAssigningOnboard(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite User Card */}
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              Invite New User
            </CardTitle>
            <CardDescription>Send an invitation to a new user</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="User's Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-stone-300 focus:border-stone-500"
                  autoFocus
                  disabled={isLoading}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {message && (
                  <p className="text-green-500 text-sm mt-2">{message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-stone-600 hover:bg-stone-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List Card */}
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              System Users
            </CardTitle>
            <CardDescription>
              Manage existing users in the system
            </CardDescription>
            <div className="mt-2">
              <Button
                onClick={handleAssignOnboardToAll}
                disabled={assigningOnboard}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {assigningOnboard
                  ? "Assigning..."
                  : "Assign Onboard Role to Users Without Roles"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p className="text-stone-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-stone-500">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border border-stone-200 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-stone-700">
                          {user.email}
                        </p>
                        <p className="text-sm text-stone-500">
                          Joined:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 text-xs bg-stone-100 text-stone-700 rounded flex items-center gap-1"
                          >
                            {role.name}
                            <button
                              onClick={() =>
                                handleRemoveRole(user.id, role.name)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Role Assignment */}
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignRole(user.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="text-xs border border-stone-300 rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Assign Role</option>
                        {roles
                          .filter(
                            (role) =>
                              !user.roles.some(
                                (userRole) => userRole.name === role.name
                              )
                          )
                          .map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
