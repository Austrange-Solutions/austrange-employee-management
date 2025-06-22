import React from "react";
import Image from "next/image";
function LogoSection() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2">
        <Image
          src={"/assets/images/Austrange Logo.png"}
          alt="Logo"
          width={64}
          height={64}
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Austrange Solutions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Employee Management Portal
      </p>
    </div>
  );
}

export default LogoSection;
