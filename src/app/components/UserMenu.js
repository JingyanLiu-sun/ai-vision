import Link from "next/link";
import { auth } from "@/auth";
import UserDropdown from "./UserDropdown";

export default async function UserMenu({ lang }) {
  const session = await auth();
  if (!session?.user) {
    return <Link href={`/${lang}/auth/signin`} className="text-blue-600 font-medium hover:text-blue-700">登录</Link>;
  }
  return (
    <UserDropdown user={session.user} lang={lang} />
  );
}
