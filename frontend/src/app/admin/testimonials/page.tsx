"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="Testimonials"
      endpoint="/content/testimonials?all=true"
      columns={[
        { key: "name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "rating", label: "Rating" },
      ]}
    />
  );
}
