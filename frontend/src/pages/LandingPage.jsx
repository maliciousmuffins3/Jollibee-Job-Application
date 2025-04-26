import React, { useState } from "react";
import "daisyui";
import HeroImage from "../assets/hero-image.png"; // Hero image import
import Logo from "../assets/company-logo.png"; // Logo import

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="w-full p-5 bg-red-600 flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="w-16 h-16" />
          <h1 className="text-3xl font-bold text-white">Jollibee</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#requirements" className="text-white hover:text-yellow-300">
            Requirements
          </a>
          <a href="#faq" className="text-white hover:text-yellow-300">
            FAQ
          </a>
          <button className="btn bg-red-700 text-white border-none hover:bg-red-800">
            Contact Us
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          &#9776;
        </button>
      </header>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="md:hidden bg-red-600 text-center p-5 space-y-4 absolute top-16 left-0 right-0 z-40">
          <a href="#requirements" className="text-white block hover:text-yellow-300">
            Requirements
          </a>
          <a href="#faq" className="text-white block hover:text-yellow-300">
            FAQ
          </a>
          <button className="btn bg-red-700 text-white w-full border-none hover:bg-red-800">
            Contact Us
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center md:justify-between min-h-screen p-6 bg-gray-900">
        <div className="text-center md:text-left max-w-lg">
          <h2 className="text-yellow-400 font-bold" style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}>
            Your Future Starts Here
          </h2>
          <p className="text-lg text-gray-300 mt-4" style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}>
            Join our team and build an amazing career with us.
          </p>
          <button
            className="btn bg-red-600 text-white mt-6 hover:bg-red-700 border-none"
            onClick={() => setIsOpen(true)}
          >
            Apply Now
          </button>
        </div>

        {/* Hero Image */}
        <div className="hidden md:block w-full md:w-1/2 mt-10 md:mt-0 overflow-hidden">
          <img src={HeroImage} alt="Hero" className="w-full rounded-lg translate-x-2" />
        </div>
      </section>

      {/* Application Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mx-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto relative border border-gray-500">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Application Form</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Upload Resume</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  required
                />
              </div>

              <button type="submit" className="btn bg-red-600 text-white w-full hover:bg-red-700 border-none">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
