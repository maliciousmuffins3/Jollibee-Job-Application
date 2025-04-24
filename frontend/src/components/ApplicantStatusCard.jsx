import { XCircle, CheckCircle, Clock, User } from "lucide-react";
import companyLogo from "../assets/company-logo.png";
import profileSample from '../assets/profileSample.png';

function ApplicantStatusCard({
  name = "Matthew Roxas",
  applyingFor = "Software Engineer",
  date = new Date().toLocaleDateString(),
  profilePic = null,
  status = "under review",
  resumeStatus = "passed",
  birthCertificateStatus = "pending",
  email = "matthew.roxas@example.com",
  interviewDate = null,
}) {
  // Define status styles
  const statusStyles = {
    "waiting for interview": {
      color: "badge-warning text-white",
      icon: <Clock size={18} />,
      message: "Schedule an interview.",
    },
    "under review": {
      color: "badge-info text-white",
      icon: <CheckCircle size={18} />,
      message: "Application is under evaluation by the hiring team.",
    },
    rejected: {
      color: "badge-error text-white",
      icon: <XCircle size={18} />,
      message: "Resume is not suitable for the position.",
    },
  };

  const { color, icon, message } =
    statusStyles[status] || statusStyles["under review"];

  return (
    <div className="card w-full max-w-md bg-gray-800 shadow-lg border border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:gap-6">
      {/* Profile Picture */}
      <div className="avatar mb-4 sm:mb-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
          {/* Use profilePic if available, otherwise use profileSample */}
          <img
            src={profilePic || profileSample}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-100">{name}</h3>
        <p className="text-sm text-gray-400">
          Applying for: <span className="text-gray-300">{applyingFor}</span>
        </p>
        <p className="text-sm text-gray-400">
          Date Applied: <span className="text-gray-300">{date}</span>
        </p>

        {/* Status */}
        <div
          className={`badge ${color} flex items-center gap-2 px-3 py-1 rounded-full font-medium mt-4`}
        >
          {icon} <span className="capitalize">{status}</span>
        </div>

        {/* Status Message */}
        <p className="text-sm text-gray-400 mt-2">{message}</p>

        {/* Interview Date */}
        {status === "waiting for interview" && interviewDate ? (
          <p className="text-sm text-gray-400 mt-2">
            Interview scheduled on:{" "}
            <span className="text-gray-300">{interviewDate}</span>
          </p>
        ) : null}

        <div className="mt-4 text-left">
          <p className="text-sm text-gray-400">
            Resume:
            <span
              className={`text-sm ${
                resumeStatus === "passed" ? "text-green-500" : "text-red-500"
              } ml-1`}
            >
              {resumeStatus === "passed" ? "Passed" : "Not Passed"}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Birth Certificate:
            <span
              className={`text-sm ${
                birthCertificateStatus === "passed"
                  ? "text-green-500"
                  : "text-red-500"
              } ml-1`}
            >
              {birthCertificateStatus === "passed"
                ? "Passed"
                : "Not Provided"}
            </span>
          </p>
        </div>

        {/* Email ID */}
        <p className="text-sm text-gray-400 mt-4">
          Email: <span className="text-gray-300">{email}</span>
        </p>
      </div>
    </div>
  );
}

export default ApplicantStatusCard;
