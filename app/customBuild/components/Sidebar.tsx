import React from "react";
import {
  Home,
  Info,
  MessageCircleCode,
  ArrowLeftFromLineIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const currentRoute = usePathname();

  const getLinkClass = (path: string) => {
    return currentRoute === path
      ? "px-10 py-3 flex items-center gap-3 text-white bg-[#161844]"
      : "px-10 py-3 flex items-center gap-3 text-white";
  };

  return (
    <div className="bg-muted flex flex-col items-center justify-center py-4 bg-[#50CFFB] h-full">

    
     <div className="flex items-center flex-col-reverse">
     <Image
        src={"/images/logo.png"}
        alt="logo"
        width={200}
        height={200}
        className="p-4"
      />
     </div>
       {/* <div className="mt-20"></div> */}

      <div className="flex-grow flex flex-col space-y-2">
        <Link href="/customBuild" aria-label="Home">
          <span className={getLinkClass("/customBuild")}>
            <Home className="h-5 w-5" />
            <span>Generate Prompt</span>
          </span>
        </Link>
        <Link href="/customBuild/inspect-prompt" aria-label="Prompt">
          <span className={getLinkClass("/customBuild/inspect-prompt")}>
            <Info className="h-5 w-5" />
            <span>Inspect Prompt</span>
          </span>
        </Link>
        <Link href="/customBuild/test-prompt" aria-label="Test">
          <span className={getLinkClass("/customBuild/test-prompt")}>
            <MessageCircleCode className="h-5 w-5" />
            <span>Test Prompt</span>
          </span>
        </Link>
      </div>
      <button
        onClick={() => router.replace("/")}
        className="flex items-center gap-2 text-white px-4 py-2 bg-[#052B92]"
        aria-label="Go back"
      >
        <ArrowLeftFromLineIcon className="h-5 w-5" />
        <span>Back</span>
      </button>

    </div>
  );
};

export default Sidebar;
