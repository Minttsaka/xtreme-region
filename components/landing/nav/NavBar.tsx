"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Logo from "@/components/Logo"

interface MenuItem {
  name: string;
  description: string;
  image: string;
  href: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuContent {
  title: string;
  description: string;
  sections: MenuSection[];
}


// Sample navigation data with hover menu content
const navItems = [
 {
    label: "Solutions",
    href: "/solutions",
    hasMenu: true,
    menuContent: {
      title: "Solutions by Industry",
      description: "Tailored solutions for your specific needs",
      sections: [
        {
          title: "Meeting",
          items: [
            {
              name: "Schedule Meeting",
              description: "You can schedule a meeting in just simple steps",
              image: "/placeholder.svg?height=60&width=60",
              href: "/i/meeting/schedule",
            },
            {
              name: "Join Meeting",
              description: "Communicate with your team in real-time",
              image: "/placeholder.svg?height=60&width=60",
              href: `${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join`,
            },
          ],
        },
        {
          title: "Academics",
          items: [
            {
              name: "Institution Management",
              description: "Manage your institution effectively",
              image: "/placeholder.svg?height=60&width=60",
              href: "/i/channel",
            },
            {
              name: "Manage Channel",
              description: "Manage your channel effectively to earn more",
              image: "/placeholder.svg?height=60&width=60",
              href: "/i/channel",
            },
            {
              name: "Channels",
              description: "Explore channels to learn and grow",
              image: "/placeholder.svg?height=60&width=60",
              href: "/channels",
            },
          ],
        },
        {
          title: "Research",
          items: [
            {
              name: "Conduct Research",
              description: "Conduct research with our AI powerful tools",
              image: "/placeholder.svg?height=60&width=60",
              href: "/i/research",
            },
            {
              name: "Quick Survey",
              description: "Create and distribute surveys easily",
              image: "/placeholder.svg?height=60&width=60",
              href: "/i/research/survey",
            },
            
          ],
        },
      ],
    },
  },
  {
  label: "Use Cases",
  href: "/use-cases",
  hasMenu: true,
  menuContent: {
    title: "Use Cases",
    description: "Explore how different users benefit from our platform",
    sections: [
      {
        title: "Institution Management",
        items: [
          {
            name: "School",
            description: "Digitize school operations like admissions, analysis, reports or performance",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/school-administrators",
          },
          {
            name: "Teachers",
            description: "Streamline teaching, grading, attendance and student progress tracking",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/teachers",
          },
          {
            name: "For Students",
            description: "Access class materials, schedules, and feedback",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/students",
          },
        ],
      },
      {
        title: "Research & Survey",
        items: [
          {
            name: "For Researchers",
            description: "Collaborate on research projects and share findings",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/researchers",
          },
          {
            name: "For Survey Administrators",
            description: "Design and distribute surveys, and analyze data",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/surveys",
          },
        ],
      },
      {
        title: "Video Conferencing & Content",
        items: [
          {
            name: "For Live Classes & Webinars",
            description: "Host interactive sessions, guest lectures, and virtual classrooms",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/live-classes",
          },
          {
            name: "For Content Creators",
            description: "organize, and share educational expertise with learners and monetize",
            image: "/placeholder.svg?height=60&width=60",
            href: "/use-cases/content-creators",
          },
        ],
      },
    ],
  },
}
,
  
  {
    label: "Resources",
    href: "/resources",
    hasMenu: true,
    menuContent: {
      title: "Learning Resources",
      description: "Everything you need to succeed",
      sections: [
        {
          title: "Documentation",
          items: [
            
            {
              name: "Getting Started",
              description: "Quick start guide",
              image: "/placeholder.svg?height=60&width=60",
              href: "/docs/getting-started",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              name: "Blog",
              description: "Latest insights and updates",
              image: "/placeholder.svg?height=60&width=60",
              href: "/blog",
            },
            {
              name: "Community Forum",
              description: "Connect with other users",
              image: "/placeholder.svg?height=60&width=60",
              href: "/community",
            },
          ],
        },
      ],
    },
  },
  {
    label: "Pricing",
    href: "/pricing",
    hasMenu: false,
  },
  {
    label: "About",
    href: "/about",
    hasMenu: false,
  },
]

// Hover menu component
const HoverMenu = ({ content, isVisible }: { content: MenuContent; isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[900px] z-50"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.description}</p>
          </div>

          {/* Content Grid */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3">
              {content.sections.map((section: any, sectionIndex: number) => (
                <div key={sectionIndex}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{section.title}</h4>
                  <div className="space-y-3">
                    {section.items.map((item: any, itemIndex: number) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Need help?{" "}
                <Link href="/support" className="text-blue-600 hover:text-blue-700">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }
  // Attach scroll event listener
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll)
  }
  // Clean up the event listener on component unmount

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.hasMenu && setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-800 uppercase hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      {item.label}
                      {item.hasMenu && (
                        <svg
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            hoveredItem === item.label ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    {item.hasMenu && <HoverMenu content={item.menuContent as MenuContent} isVisible={hoveredItem === item.label} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-x-3 xs:gap-x-6">
              <a
                className="relative focus-visible:outline outline-[rgba(0,0,0,0.64)] rounded-xl outline-offset-[3px] inline-block"
                href="/?q=support"
              >
                <div className="text-gray-800 font-sm justify-center flex flex-nowrap whitespace-nowrap transition-translate duration-300 cursor-pointer group items-center h-full group leading-[150%] text-sm px-[30px] py-2">
                  Contact Support{" "}
                  <span className="inline-block ml-1 text-gray-800 font-normal duration-300 w-fit transition-translate group-hover:translate-x-1 font-unicode">
                    →
                  </span>
                </div>
                <span className="after:content-[''] after:inline-block absolute inset-0 after:inset-0 after:absolute select-none pointer-events-none after:rounded-[11px] rounded-[11px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] after:shadow-[inset_0_0_0_1px_rgba(0,139,255,0.2)]"></span>
              </a>
            </div>
            <div className="flex items-center gap-x-3 xs:gap-x-6">
              <a
                className="relative focus-visible:outline outline-[rgba(0,0,0,0.64)] rounded-xl outline-offset-[3px] inline-block"
                href="/i/dashboard"
              >
                <div className="text-gray-800 font-sm justify-center flex flex-nowrap whitespace-nowrap transition-translate duration-300 cursor-pointer group items-center h-full group leading-[150%] text-sm px-[30px] py-2">
                  Get Started{" "}
                  <span className="inline-block ml-1 text-gray-800 font-normal duration-300 w-fit transition-translate group-hover:translate-x-1 font-unicode">
                    →
                  </span>
                </div>
                <span className="after:content-[''] after:inline-block absolute inset-0 after:inset-0 after:absolute select-none pointer-events-none after:rounded-[11px] rounded-[11px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] after:shadow-[inset_0_0_0_1px_rgba(0,139,255,0.2)]"></span>
              </a>
            </div>
          </div>

          <div className="lg:hidden">
            <div
              className="flex z-50 sticky items-center cursor-pointer lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <svg className="w-6 h-auto fill-current text-gray-800" viewBox="0 0 24 12">
                <rect width="24" height="2"></rect>
                <rect y="5" width="24" height="2"></rect>
                <rect y="10" width="24" height="2"></rect>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
         <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.hasMenu ? (
                  <MobileMenuWithSubmenu item={item} />
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="px-4 py-3 space-y-3 border-t border-gray-100">
            <div className="flex items-center gap-x-3 xs:gap-x-6">
              <a
                className="relative focus-visible:outline outline-[rgba(0,0,0,0.64)] rounded-xl outline-offset-[3px] inline-block"
                href="/error"
              >
                <div className="font-medium justify-center flex flex-nowrap whitespace-nowrap transition-translate duration-300 cursor-pointer group items-center h-full group leading-[150%] text-sm px-[30px] py-[14px]">
                  Contact support{" "}
                  <span className="inline-block ml-1 font-normal duration-300 w-fit transition-translate group-hover:translate-x-1 font-unicode">
                    →
                  </span>
                </div>
                <span className="after:content-[''] after:inline-block absolute inset-0 after:inset-0 after:absolute select-none pointer-events-none after:rounded-[11px] rounded-[11px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] after:shadow-[inset_0_0_0_1px_rgba(0,139,255,0.2)]"></span>
              </a>
            </div>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600">
              Sign Up
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

const MobileMenuWithSubmenu = ({ item }: { item: any }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left text-gray-800 hover:text-blue-600 flex items-center justify-between px-3 py-3 rounded-md text-base font-medium"
      >
        {item.label}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4">
              {/* Header */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.menuContent.title}</h3>
                <p className="text-sm text-gray-600">{item.menuContent.description}</p>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {item.menuContent.sections.map((section: any, sectionIndex: number) => (
                  <div key={sectionIndex}>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide px-2">
                      {section.title}
                    </h4>
                    <div className="space-y-2">
                      {section.items.map((subItem: any, itemIndex: number) => (
                        <Link
                          key={itemIndex}
                          href={subItem.href}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsExpanded(false)}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                              <Image
                                src={subItem.image || "/placeholder.svg"}
                                alt={subItem.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{subItem.name}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subItem.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-col space-y-2 text-center">
                  <Link
                    href="/support"
                    className="text-sm text-blue-600 hover:text-blue-700"
                    onClick={() => setIsExpanded(false)}
                  >
                    Contact support
                  </Link>
                  <Link
                    href="/docs"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setIsExpanded(false)}
                  >
                    View all docs →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
