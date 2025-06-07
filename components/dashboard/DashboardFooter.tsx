import React from "react"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const DashboardFooter = () => {
  return (
    <footer className="bg-gray-900 text-xs text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">DashMaster Pro</h3>
          <p className="mb-4">Empowering your data-driven decisions with cutting-edge dashboard solutions.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              <Facebook size={17} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Twitter size={17} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Instagram size={17} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Linkedin size={17} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Youtube size={17} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Github size={17} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "About", "Services", "Products", "Contact", "FAQ", "Terms of Service", "Privacy Policy"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 flex items-center">
                    <ArrowRight size={16} className="mr-2" />
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Our Services</h4>
          <ul className="space-y-2">
            {[
              "Data Visualization",
              "Real-time Analytics",
              "Custom Dashboards",
              "Data Integration",
              "Performance Metrics",
              "Trend Analysis",
              "Predictive Analytics",
              "Mobile Dashboards",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-400 flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
          <p className="mb-4">Subscribe to our newsletter for the latest updates and insights.</p>
          <form className="flex flex-col space-y-2">
            <Input type="email" placeholder="Enter your email" className="bg-gray-800 text-white border-gray-700" />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            <div className="flex items-center">
              <Mail size={20} className="mr-2" />
              <span>contact@dashmasterpro.com</span>
            </div>
            <div className="flex items-center">
              <Phone size={20} className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin size={20} className="mr-2" />
              <span>123 Dashboard Lane, Data City, AN 12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 DashMaster Pro. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-blue-400 mr-4">
              Terms & Conditions
            </a>
            <a href="#" className="text-sm hover:text-blue-400 mr-4">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-blue-400">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter

