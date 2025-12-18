import React from "react";
import { getDictionary } from "@/app/dictionaries";
import ProfileForm from "./ProfileForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPrisma } from "@/app/lib/prisma";

export default async function ProfilePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/auth/signin`);
  }

  const prisma = getPrisma();
  const user = await prisma.users.findUnique({
    where: {
      phone: session.user.phone, // Assuming phone is used as unique identifier in auth
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">个人信息</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProfileForm user={user} lang={lang} />
        </div>
      </div>
    </div>
  );
}
