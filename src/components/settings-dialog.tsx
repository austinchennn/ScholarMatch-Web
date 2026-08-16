"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTab, TabsIndicator, TabsPanel } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountSettingsForm } from "@/app/(app)/settings/AccountSettingsForm";

const LANGUAGE_STORAGE_KEY = "sm_language";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English (US)",
  zh: "中文",
};

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Appearance</span>
      <div className="flex gap-1.5">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? "secondary" : "outline"}
              className="flex-1"
              onClick={() => setTheme(option.value)}
            >
              <Icon data-icon="inline-start" />
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function LanguageSection() {
  const [language, setLanguage] = useState(
    () => window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? "en"
  );

  function handleChange(value: string | null) {
    if (!value) return;
    setLanguage(value);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Language</span>
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue>{(value: string) => LANGUAGE_LABELS[value] ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English (US)</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        ScholarMatch is English-only for now — full translations are coming soon.
      </p>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="flex flex-col gap-6">
      <AppearanceSection />
      <LanguageSection />
    </div>
  );
}

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account and app preferences.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsIndicator />
            <TabsTab value="account">Account</TabsTab>
            <TabsTab value="general">General</TabsTab>
          </TabsList>
          <TabsPanel value="account" className="max-h-[60vh] overflow-y-auto">
            <AccountSettingsForm />
          </TabsPanel>
          <TabsPanel value="general">
            <GeneralSettings />
          </TabsPanel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
