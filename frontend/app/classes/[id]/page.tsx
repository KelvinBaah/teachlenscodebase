import { redirect } from "next/navigation";

type ClassAliasPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClassAliasPage({ params }: ClassAliasPageProps) {
  const { id } = await params;
  redirect(`/dashboard/classes/${id}`);
}
