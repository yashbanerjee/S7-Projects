"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/brand";
import { authHeaders } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${siteConfig.apiUrl}/content/settings`)
      .then((r) => r.json())
      .then((j) => setValue(JSON.stringify(j.data || {}, null, 2)))
      .catch(() => setValue("{}"));
  }, []);

  const save = async () => {
    try {
      const parsed = JSON.parse(value);
      await fetch(`${siteConfig.apiUrl}/content/settings/site`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ value: parsed.site || parsed }),
      });
      setStatus("Settings saved.");
    } catch {
      setStatus("Invalid JSON or API error.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Website Settings & SEO</h1>
      <p className="mt-2 text-muted">
        Edit site contact details, social links, and SEO-related configuration as JSON.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={18}
        className="mt-8 w-full border border-line bg-white p-4 font-mono text-sm outline-none focus:border-pink"
      />
      <div className="mt-4 flex items-center gap-4">
        <Button type="button" onClick={save}>
          Save settings
        </Button>
        {status && <p className="text-sm text-pink">{status}</p>}
      </div>
    </div>
  );
}
