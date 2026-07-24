import { redirect } from "next/navigation";

export default async function LegacyTrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/treinar/${id}`);
}
