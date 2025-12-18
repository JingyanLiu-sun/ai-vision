"use client";

import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import { setCookie } from "cookies-next";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function ClientLanguageSelect({ currentLang, languageOptions }) {
  const pathname = usePathname();

  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return;

    const currentPathSegments = pathname.split("/").filter(Boolean);
    currentPathSegments[0] = String(newLang);
    const newPath = `/${currentPathSegments.map(segment => encodeURIComponent(String(segment))).join("/")}`;

    setCookie("NEXT_LOCALE", newLang, { maxAge: 365 * 24 * 60 * 60 });
    window.location.href = newPath;
  };

  return (
    <div className="relative w-40">
      <Listbox value={currentLang} onChange={handleLanguageChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm hover:border-gray-300 transition-colors">
            <span className="block truncate">
               {languageOptions[currentLang]}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FontAwesomeIcon
                icon={faChevronDown}
                className="h-3 w-3 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
              {Object.entries(languageOptions).map(([code, name]) => (
                <Listbox.Option
                  key={code}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={code}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
