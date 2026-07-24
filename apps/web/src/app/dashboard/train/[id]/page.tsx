import { redirect } from "next/navigation";

export default async function LegacyDashboardTrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/treinar/${encodeURIComponent(id)}`);
}
