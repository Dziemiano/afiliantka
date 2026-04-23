'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-stone-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-stone-700">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-stone-600">
            There was an error during the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm mt-2">{error || "An unknown error occurred."}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
