"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="Portfolio"
      endpoint="/portfolio?all=true"
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "location", label: "Location" },
        { key: "year", label: "Year" },
      ]}
    />
  );
}
