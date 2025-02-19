"use client";

import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rates", href: "/rates" },
  { name: "API-TEST", href: "/api-test" },
  { name: "Associated Accounts", href: "/associated-accounts" },
  { name: "Profile Settings", href: "/profile-settings" },
];

/** Helper function for conditional class names */
const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export function NavBar({ authProvider }: { authProvider: string }) {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2"
                  aria-label="Toggle main menu"
                >
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo & Navigation */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                  <img
                    className="h-8 w-auto"
                    src="https://assets.enmax.com/api/public/content/0612045520e544f7838825c672f137e6"
                    alt="Your Company"
                  />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={pathname === item.href ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Menu & Notifications */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Notification Button */}
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="View notifications"
                >
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* User Dropdown Menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      aria-label="User menu"
                    >
                      <img className="h-10 w-10 rounded-full" src="https://img.cryptorank.io/coins/chill_guy1731936768520.png" alt="User Avatar" />
                    </Menu.Button>
                  </div>

                  {/* Dropdown Items */}
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Signed in with: <strong>{authProvider}</strong>
                    </div>
                    {[
                      { name: "Rates", href: "/rates" },
                      { name: "Page2", href: "/" },
                      { name: "Page3", href: "/" },
                    ].map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Panel */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
