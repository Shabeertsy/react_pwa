const Navbar = () => (
  <nav className="py-4 px-12 bg-white drop-shadow-md z-20">
    <div className="container flex items-center justify-between">
      <div className="flex items-center font-bold text-2xl">
        <img
          src="/logo-light.png"
          alt="Click4Trip Logo"
          className="h-18 w-auto mr-3"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="space-x-8 text-gray-700 font-medium text-sm">
        <a href="#" className="hover:text-[#c0404a] no-underline" style={{ textDecoration: "none" ,color:"black" }}>Home</a>
        <a href="#" className="hover:text-[#c0404a] no-underline" style={{ textDecoration: "none",color:"black"  }}>faq</a>
        <a href="#" className="hover:text-[#c0404a] no-underline" style={{ textDecoration: "none",color:"black"  }}>Contact us</a>
      </div>
    </div>
  </nav>
);
  
  export default Navbar;