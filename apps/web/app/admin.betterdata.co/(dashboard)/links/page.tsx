import AdminLinksClient from "../../../app.betterdata.co/(dashboard)/[slug]/page-client";
import { Suspense } from "react";

export default function AdminLinks() {
  return (
    <Suspense>
      <AdminLinksClient />
    </Suspense>
  );
}
