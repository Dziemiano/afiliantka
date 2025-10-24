"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Manage users, files, and system resources from the admin panel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              User Management
            </CardTitle>
            <CardDescription>
              Invite users and manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full bg-stone-600 hover:bg-stone-700 text-white">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              File Management
            </CardTitle>
            <CardDescription>Upload and manage system files</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/files">
              <Button className="w-full bg-stone-600 hover:bg-stone-700 text-white">
                Manage Files
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              System Overview
            </CardTitle>
            <CardDescription>Monitor system status and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-stone-600">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
