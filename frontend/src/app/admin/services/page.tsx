"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="Services"
      endpoint="/services?all=true"
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "featured", label: "Featured" },
      ]}
    />
  );
}
