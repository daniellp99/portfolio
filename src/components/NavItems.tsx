import React from "react";

const TABS = [
  { key: "all", name: "All" },
  { key: "about", name: "About" },
  { key: "projects", name: "Projects" },
];

export default function NavItems() {
  return (
    <div className="flex flex-row justify-evenly rounded-full border-2 bg-zinc-200 p-1 dark:border-gray-700 dark:bg-transparent">
      {TABS.map((tab) => (
        <button
          className="rounded-full px-3 text-xl hover:text-gray-500 active:bg-gray-50 dark:active:bg-gray-500"
          key={tab.key}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
