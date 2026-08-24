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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              System administration and management
            </p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700">
          Manage users, files, and system resources from the admin panel. Use
          the cards below to access different administrative functions.
        </p>
      </div>

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
              Newsletter
            </CardTitle>
            <CardDescription>
              Subskrybenci ze strony publicznej i eksport CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/newsletter">
              <Button className="w-full bg-stone-600 hover:bg-stone-700 text-white">
                Zarządzaj newsletterem
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              Publikacja treści
            </CardTitle>
            <CardDescription>
              Ogłoś nowe materiały i powiadom użytkowników
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/content">
              <Button className="w-full bg-stone-600 hover:bg-stone-700 text-white">
                Opublikuj treść
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              Analityka
            </CardTitle>
            <CardDescription>
              Ruch na stronie publicznej, kliknięcia ofert, onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/analytics">
              <Button className="w-full bg-stone-600 hover:bg-stone-700 text-white">
                Zobacz analitykę
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
