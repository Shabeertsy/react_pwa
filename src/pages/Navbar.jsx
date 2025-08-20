import { FaHome, FaQuestionCircle, FaPhone } from "react-icons/fa";

const navLinks = [
  {
    label: "Home",
    href: "#",
    icon: <FaHome size={22} />,
  },
  {
    label: "FAQ",
    href: "#",
    icon: <FaQuestionCircle size={22} />,
  },
  {
    label: "Contact Us",
    href: "#",
    icon: <FaPhone size={22} />,
  },
];

const Navbar = () => (
  <>
    {/* Desktop/Tablet Navbar */}
    <nav className="py-4 px-4 md:px-12 bg-white drop-shadow-md z-20 fixed z-50 top-0 left-0 right-0 md:static">
      <div className="container flex items-center justify-between md:justify-between justify-center">
        {/* Logo: Centered on mobile, left on desktop */}
        <div className="flex items-center font-bold text-2xl mx-auto md:mx-0">
          <img
            src="/logo-light.png"
            alt="Click4Trip Logo"
            className="h-12 w-auto mr-0 md:mr-3"
            style={{ objectFit: "contain" }}
          />
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#c0404a] no-underline"
              style={{ textDecoration: "none", color: "black" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navbar */}
    <nav className="fixed bottom-0 left-0 right-0 bg-white drop-shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-30 flex md:hidden justify-around items-center h-16 border-t">
      {navLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="flex flex-col items-center justify-center text-gray-700 hover:text-[#c0404a] text-xs font-medium"
          style={{ textDecoration: "none" }}
        >
          {link.icon}
          <span className="mt-1">{link.label}</span>
        </a>
      ))}
    </nav>
    <div className="md:hidden h-16" />
  </>
);

export default Navbar;