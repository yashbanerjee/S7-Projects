"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="Quote Requests"
      endpoint="/quotes"
      columns={[
        { key: "company", label: "Company" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "service", label: "Service" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
