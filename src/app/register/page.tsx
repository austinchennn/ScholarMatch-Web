"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  registerAction,
  requestCodeAction,
  type ActionState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: ActionState = {};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);

  const [codeState, codeFormAction, codePending] = useActionState(
    requestCodeAction,
    initialState
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    initialState
  );

  if (codeState.success && !codeRequested) {
    setCodeRequested(true);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            {codeRequested
              ? `Enter the code sent to ${email}.`
              : "We'll email you a verification code first."}
          </CardDescription>
        </CardHeader>

        {!codeRequested ? (
          <form action={codeFormAction}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {codeState.error && (
                <p className="text-sm text-destructive">{codeState.error}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={codePending}>
                {codePending ? "Sending code…" : "Send verification code"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form action={registerFormAction}>
            <input type="hidden" name="email" value={email} />
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Verification code</Label>
                <Input id="code" name="code" required maxLength={6} />
              </div>
              {registerState.error && (
                <p className="text-sm text-destructive">
                  {registerState.error}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={registerPending}>
                {registerPending ? "Creating account…" : "Create account"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setCodeRequested(false)}
              >
                Use a different email
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
