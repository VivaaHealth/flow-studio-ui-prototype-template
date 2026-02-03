"use client"

import { useState } from "react"
import { Search, ChevronRight, ChevronDown, FileText, LogOut } from "lucide-react"
import Image from "next/image"

const navigationItems = [
  { id: "build", label: "Build" },
  { id: "analyze", label: "Analyze" },
  { id: "operate", label: "Operate" },
  { id: "integrate", label: "Integrate" },
  { id: "manage", label: "Manage" },
]

const buildSubItems = [
  { id: "flows", label: "Flows", active: true },
  { id: "assistants", label: "Assistants", active: false },
  { id: "knowledge-bases", label: "Knowledge Bases", active: false },
  { id: "reference-tables", label: "Reference Tables", active: false },
  { id: "runs", label: "Runs", active: false },
  { id: "scenarios", label: "Scenarios", active: false },
]

const secondaryItems = [
  { id: "templates", label: "Templates" },
  { id: "mappings", label: "Mappings" },
  { id: "tools", label: "Tools" },
]

export function SideNavigation() {
  const [searchValue, setSearchValue] = useState("")
  const [expandedBuild, setExpandedBuild] = useState(true)

  return (
    <div
      className="w-[208px] max-w-[208px] h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #030A33 0%, #00044B 100%)" }}
    >
      <div className="h-14 flex items-center justify-start px-4">
        <Image src="/images/notable-logo.png" alt="Notable logo" width={113} height={32} className="object-contain" />
      </div>

      <div className="border-t border-[#2a3441]"></div>

      <div className="px-4 py-2.5">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-7 pr-3 py-2 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-sm pb-0 pt-0"
          />
        </div>
      </div>

      <div className="border-t border-[#2a3441]"></div>

      <div className="flex-1 pt-1">
        {navigationItems.map((item) => (
          <div className="pl-0 pb-0" key={item.id}>
            <button
              className="w-full flex items-center justify-between px-4 text-left text-white hover:opacity-80 transition-opacity group py-2"
              onClick={() => item.id === "build" && setExpandedBuild(!expandedBuild)}
            >
              <span className="text-sm font-normal">{item.label}</span>
              {item.id === "build" ? (
                expandedBuild ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-opacity" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-opacity" />
                )
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 transition-opacity" />
              )}
            </button>

            {item.id === "build" && expandedBuild && (
              <div className="ml-4">
                {buildSubItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`w-full flex items-center px-4 text-left transition-all relative py-1 mx-0 gap-0 ${
                      subItem.active ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {subItem.active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
                    <span className="text-sm font-normal">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-[#2a3441] my-1"></div>

        {secondaryItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center justify-between px-4 text-left text-white hover:opacity-80 transition-opacity group py-2"
          >
            <span className="text-sm font-normal">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 transition-opacity" />
          </button>
        ))}
      </div>

      <div className="border-t border-[#2a3441] mt-auto">
        <button className="w-full flex items-center gap-3 px-4 text-left text-white hover:opacity-80 transition-opacity py-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-normal">Documentation</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 text-left text-white hover:opacity-80 transition-opacity py-2">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-normal">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
