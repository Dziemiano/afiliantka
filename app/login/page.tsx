"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push("/");
    } else {
      setError("Nieprawidłowe hasło");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-stone-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-stone-700">
            Afiliantka Faceless
          </CardTitle>
          <CardDescription className="text-stone-600">
            Wprowadź hasło aby uzyskać dostęp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-stone-300 focus:border-stone-500"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-stone-600 hover:bg-stone-700 text-white"
            >
              Zaloguj się
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
