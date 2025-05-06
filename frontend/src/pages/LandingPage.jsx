import React, { useState, useEffect } from "react";
import "daisyui";
import HeroImage from "../assets/hero-image.png";
import Logo from "../assets/company-logo.png";

const LandingPage = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    applyingPosition: "",
    file: null,
  });
  const [responseMsg, setResponseMsg] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/available_position/show-positions");
        const data = await res.json();
        setJobRoles(data);
      } catch (err) {
        console.error("Failed to fetch job roles:", err);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("phoneNumber", formData.phoneNumber);
    form.append("applyingPosition", formData.applyingPosition);
    form.append("file", formData.file);

    try {
      const res = await fetch("http://localhost:5000/applicants/add-applicant", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setResponseMsg({ message: data.message, type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          applyingPosition: "",
          file: null,
        });
      } else {
        setResponseMsg({ message: data.message, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setResponseMsg({
        message: "Error submitting the form. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <header className="w-full p-5 bg-red-600 flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="w-16 h-16" />
          <h1 className="text-3xl font-bold text-white">Jollibee</h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#requirements" className="text-white hover:text-yellow-300">Requirements</a>
          <a href="#faq" className="text-white hover:text-yellow-300">FAQ</a>
          <button className="btn bg-red-700 text-white border-none hover:bg-red-800">Contact Us</button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsNavOpen(!isNavOpen)}>
          &#9776;
        </button>
      </header>

      {isNavOpen && (
        <div className="md:hidden bg-red-600 text-center p-5 space-y-4 absolute top-16 left-0 right-0 z-40">
          <a href="#requirements" className="text-white block hover:text-yellow-300">Requirements</a>
          <a href="#faq" className="text-white block hover:text-yellow-300">FAQ</a>
          <button className="btn bg-red-700 text-white w-full border-none hover:bg-red-800">Contact Us</button>
        </div>
      )}

      {/* Hero Section */}
{/* Hero Section */}
<section className="flex flex-col md:flex-row items-center justify-center md:justify-between min-h-screen p-6 bg-gray-900 pt-20">
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
    {/* Anchor to Available Jobs Section */}
    <p className="text-sm text-gray-400 mt-3">
      Looking for a role? <a href="#available-jobs" className="text-yellow-400 hover:underline">See Available Jobs</a>
    </p>
  </div>

  <div className="hidden md:block w-full md:w-1/2 mt-10 md:mt-0 overflow-hidden">
    <img src={HeroImage} alt="Hero" className="w-full rounded-lg translate-x-2" />
  </div>
</section>

{/* Available Positions Section */}
<section className="bg-gray-950 py-16 px-6 md:px-20 text-gray-100" id="available-jobs">
  <div className="text-center mb-10">
    <h3 className="text-3xl font-bold text-red-500">Available Positions</h3>
    <p className="text-gray-400 mt-2">Explore roles that match your skills and passion.</p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {jobRoles.length === 0 ? (
      <p className="col-span-full text-center text-gray-400">No positions currently available.</p>
    ) : (
      jobRoles.map((job) => (
        <div
          key={job.id}
          className="bg-gray-800 text-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <h4 className="text-xl font-semibold text-yellow-400">{job.role}</h4>
          <p className="text-gray-300 mt-2">{job.requirements}</p>
        </div>
      ))
    )}
  </div>
</section>

      {/* Application Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mx-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto relative border border-gray-500">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => {
                setIsOpen(false);
                setResponseMsg({ message: "", type: "" });
              }}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Application Form</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400">Applying Position</label>
                <select
                  name="applyingPosition"
                  value={formData.applyingPosition}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select a position</option>
                  {jobRoles.map((job) => (
                    <option key={job.id} value={job.role}>
                      {job.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400">Upload Resume</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="file-input file-input-bordered w-full"
                  required
                />
              </div>

              {responseMsg.message && (
                <p className={`text-center text-sm ${responseMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {responseMsg.message}
                </p>
              )}

              <button
                type="submit"
                className="btn bg-red-600 text-white w-full hover:bg-red-700 border-none"
              >
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
