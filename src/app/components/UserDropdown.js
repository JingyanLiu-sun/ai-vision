"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine, faKey, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDropdown({ user, lang }) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <Image
            src={user.image || "/momo.jpg"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full border border-gray-200"
            unoptimized
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-100">
             <p className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</p>
             <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/${lang}/profile`}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700 flex items-center"
                )}
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2 text-gray-400" />
                个人信息
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/${lang}/progress`}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700 flex items-center"
                )}
              >
                <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 mr-2 text-gray-400" />
                学习进度
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/${lang}/auth/password`}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700 flex items-center"
                )}
              >
                <FontAwesomeIcon icon={faKey} className="w-4 h-4 mr-2 text-gray-400" />
                修改密码
              </Link>
            )}
          </Menu.Item>
          <div className="border-t border-gray-100 my-1"></div>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/${lang}/auth/signout`}
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-red-600 flex items-center"
                )}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2 text-red-400" />
                退出
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
