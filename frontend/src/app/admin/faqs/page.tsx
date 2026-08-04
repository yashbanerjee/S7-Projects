"use client";
import AdminResourcePage from "@/components/admin/resource-table";

export default function Page() {
  return (
    <AdminResourcePage
      title="FAQ"
      endpoint="/content/faqs?all=true"
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category" },
      ]}
    />
  );
}
