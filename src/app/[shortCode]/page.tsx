import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  const url = await prisma.shortenedUrl.findUnique({
    where: { shortCode },
  });

  if (!url) {
    return notFound();
  }

  await prisma.shortenedUrl.update({
    where: { shortCode },
    data: { clicks: { increment: 1 } },
  });

  redirect(url.longUrl);
}