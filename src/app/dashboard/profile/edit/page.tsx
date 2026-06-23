import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      username: true,
      email: true,
      avatar: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link
            href="/dashboard/profile"
            className="text-sm text-neutral-500 underline underline-offset-4"
          >
            ← Назад к профилю
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            CarNotes
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Настройки аккаунта
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Управляйте профилем, email, аватаром и паролем.
          </p>
        </header>

        <section className="grid gap-6">
          <EditProfileForm user={user} />

          <ChangePasswordForm />
        </section>
      </div>
    </main>
  );
}