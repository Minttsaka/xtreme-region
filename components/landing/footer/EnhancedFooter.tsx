"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Logo from "@/components/Logo"
import { CustomButton } from "@/components/ui/CustomButton"

// Using the same navigation data structure
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/i/meeting/schedule",
            },
            {
              name: "Join Meeting",
              description: "Communicate with your team in real-time",
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/i/channel",
            },
            {
              name: "Manage Channel",
              description: "Manage your channel effectively to earn more",
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/i/channel",
            },
            {
              name: "Channels",
              description: "Explore channels to learn and grow",
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/i/research",
            },
            {
              name: "Quick Survey",
              description: "Create and distribute surveys easily",
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/use-cases/school-administrators",
            },
            {
              name: "Teachers",
              description: "Streamline teaching, grading, attendance and student progress tracking",
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/use-cases/teachers",
            },
            {
              name: "For Students",
              description: "Access class materials, schedules, and feedback",
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/use-cases/researchers",
            },
            {
              name: "For Survey Administrators",
              description: "Design and distribute surveys, and analyze data",
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/use-cases/live-classes",
            },
            {
              name: "For Content Creators",
              description: "organize, and share educational expertise with learners and monetize",
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/use-cases/content-creators",
            },
          ],
        },
      ],
    },
  },
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
              image: "/icons/link-icon.png?height=40&width=40",
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
              image: "/icons/link-icon.png?height=40&width=40",
              href: "/blog",
            },
            {
              name: "Community Forum",
              description: "Connect with other users",
              image: "/icons/link-icon.png?height=40&width=40",
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

// Additional footer-specific data
const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Press", href: "/press" },
  { name: "Contact", href: "/contact" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "GDPR", href: "/gdpr" },
]

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]


export default function EnhancedFooter() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <footer className="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-xs">
              Empowering businesses with cutting-edge solutions for analytics, automation, and growth. Join thousands of
              companies that trust us to scale their operations.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Stay Updated</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <CustomButton
                  type="submit"
                >
                  Subscribe
                </CustomButton>
              </form>
              <p className="text-xs text-gray-500 mt-2">Get the latest updates and insights delivered to your inbox.</p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social.name}</span>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {navItems.map((item) => (
                <div key={item.label}>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">{item.label}</h3>

                  {item.hasMenu ? (
                    <div className="space-y-6">
                      {item.menuContent?.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">{section.title}</h4>
                          <div className="space-y-3">
                            {section.items.map((subItem, itemIndex) => (
                              <Link
                                key={itemIndex}
                                href={subItem.href}
                                className="group flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                    <Image
                                      src={subItem.image || "/icons/link-icon.png"}
                                      alt={subItem.name}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {subItem.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subItem.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href={item.href}
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Links Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Company</h3>
              <div className="grid grid-cols-2 gap-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Legal</h3>
              <div className="grid grid-cols-2 gap-3">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-500 text-xs">© 2025 Logo. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-400">Made with</span>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs text-gray-400">in Malawi</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">All systems operational</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
