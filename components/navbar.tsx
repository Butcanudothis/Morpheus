import Image from "next/image";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { Button } from "@/components/ui/button";

export default function Navbar(): any {
  return (
      <header className="shadow mb-2">
        <div className="relative flex max-w-screen-xl flex-col overflow-hidden px-4 py-4 md:mx-auto md:flex-row md:items-center">
          <a
              href="/"
              className="flex items-center whitespace-nowrap text-2xl font-black"
          >
          <span className=" w-10 h-10 mr-2 rounded-full flex items-center justify-center">
            <Image
                src="/MorpheusLogo.svg"
                alt="Morpheus Logo Image"
                width={40}
                height={40}
                className="w-8 h-8"
            />
          </span>
            <span className="text-black">Morpheus</span>
          </a>
          <input type="checkbox" className="peer hidden" id="navbar-open" />
          <label
              className="absolute top-5 right-7 cursor-pointer md:hidden"
              htmlFor="navbar-open"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <nav
              aria-label="Header Navigation"
              className="peer-checked:mt-8 peer-checked:max-h-56 flex max-h-0 w-full flex-col items-center justify-between overflow-hidden transition-all md:ml-24 md:max-h-full md:flex-row md:items-start"
          >
            <ul className="flex flex-col items-center space-y-2 md:ml-auto md:flex-row md:space-y-0">

              <li className="text-gray-600 md:mr-12 hover:text-blue-600">
                <Link href="/privacy-policy">Privacy</Link>
              </li>
              <li className="text-gray-600 md:mr-12 hover:text-blue-600">
                <Link href="/about">About</Link>
              </li>
              <Link href="https://github.com/butcanudothis/morpheus">
                <Button
                    className="rounded-3xl border-2 border-blue-600 bg-blue-600 px-6 py-1 font-medium text-white
               transition-colors hover:bg-blue-600 hover:text-white"

                >
              <span>
                <BsGithub className="mr-2 scale-125" />
              </span>
                  Github
                </Button>
              </Link>

            </ul>
          </nav>
        </div>
      </header>
  );
}
