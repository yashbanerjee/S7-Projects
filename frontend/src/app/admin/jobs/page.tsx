"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="Jobs"
      endpoint="/jobs?all=true"
      columns={[
        { key: "title", label: "Title" },
        { key: "location", label: "Location" },
        { key: "type", label: "Type" },
        { key: "active", label: "Active" },
      ]}
    />
  );
}
