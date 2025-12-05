import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

export default async function UserMenu({ lang }) {
  const session = await auth();
  if (!session?.user) {
    return <Link href={`/${lang}/auth/signin`} className="text-blue-600">登录</Link>;
  }
  return (
    <div className="flex items-center gap-3">
      <Image src={"/momo.jpg"} alt="avatar" width={28} height={28} className="rounded-full" unoptimized />
      <Link href={`/${lang}/auth/password`} className="text-blue-600">修改密码</Link>
      <Link href={`/${lang}/auth/signout`} className="text-blue-600">退出</Link>
    </div>
  );
}
