"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changeEmailAction,
  changePasswordAction,
  deleteAccountAction,
  requestEmailChangeCodeAction,
} from "@/app/actions/account";
import { apiErrorMessage as errorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ChangeEmailSection() {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const requestCodeMutation = useMutation({
    mutationFn: () => requestEmailChangeCodeAction(newEmail),
    onSuccess: () => setCodeRequested(true),
    onError: (err) => toast.error(errorMessage(err, "Could not send verification code.")),
  });

  const confirmMutation = useMutation({
    mutationFn: () => changeEmailAction(newEmail, verificationCode, currentPassword),
    onSuccess: () => {
      toast.success("Email updated");
      setCodeRequested(false);
      setNewEmail("");
      setVerificationCode("");
      setCurrentPassword("");
      router.refresh();
    },
    onError: (err) => toast.error(errorMessage(err, "Could not change email.")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change email</CardTitle>
        <CardDescription>Requires a verification code sent to the new address.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="newEmail">New email</Label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        {!codeRequested ? (
          <Button
            className="w-fit"
            disabled={!newEmail || requestCodeMutation.isPending}
            onClick={() => requestCodeMutation.mutate()}
          >
            {requestCodeMutation.isPending ? "Sending…" : "Send verification code"}
          </Button>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="verificationCode">Verification code</Label>
              <Input
                id="verificationCode"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPasswordForEmail">Current password</Label>
              <Input
                id="currentPasswordForEmail"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-fit"
              disabled={!verificationCode || !currentPassword || confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              {confirmMutation.isPending ? "Saving…" : "Confirm email change"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => changePasswordAction(currentPassword, newPassword, confirmNewPassword),
    onSuccess: () => {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },
    onError: (err) => toast.error(errorMessage(err, "Could not change password.")),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmNewPassword">Confirm new password</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <Button
          className="w-fit"
          disabled={!currentPassword || !newPassword || !confirmNewPassword || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Change password"}
        </Button>
      </CardContent>
    </Card>
  );
}

function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: deleteAccountAction,
    onError: (err) => {
      toast.error(errorMessage(err, "Could not delete account."));
      setOpen(false);
    },
  });

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          Permanently deletes your account, postings, applications, and messages. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="destructive" />}>Delete my account</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This permanently deletes your account and all associated data. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? "Deleting…" : "Yes, delete my account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function AccountSettingsForm() {
  return (
    <div className="flex flex-col gap-6">
      <ChangeEmailSection />
      <ChangePasswordSection />
      <Separator />
      <DeleteAccountSection />
    </div>
  );
}
