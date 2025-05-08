import { useEffect, useState } from "react";
import axios from "axios";
import { RiRefreshFill } from "react-icons/ri";

function ScheduledApplicants() {
  const [scheduledApplicants, setScheduledApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Fixed rows per page
  const [loading, setLoading] = useState(false);

  const fetchScheduledApplicants = async () => {
    setLoading(true);
    try {
      const statusRes = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/applicant_status/get-all-applicant-status"
      );

      const scheduledEntries = statusRes.data.filter(
        (entry) => entry.status === "Scheduled"
      );

      const applicantRes = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/applicants/get-applicants"
      );
      const allApplicants = applicantRes.data;

      const scheduled = allApplicants
        .map((app) => {
          const status = scheduledEntries.find((entry) => entry.id === app.id);
          return status
            ? {
                ...app,
                scheduleDate: status.schedule_date,
                attended: status.attended_appointment === 1,
              }
            : null;
        })
        .filter(Boolean);

      setScheduledApplicants(scheduled);
      setFilteredApplicants(scheduled);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch scheduled applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledApplicants();
  }, []);

  const handleFilter = () => {
    let filtered = scheduledApplicants;

    if (searchTerm || selectedDate) {
      if (searchTerm) {
        filtered = filtered.filter(
          (applicant) =>
            applicant.applying_position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedDate) {
        filtered = filtered.filter(
          (applicant) =>
            new Date(applicant.scheduleDate).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString()
        );
      }
    } else {
      filtered = scheduledApplicants;
    }

    setFilteredApplicants(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDate]);

  const toggleAttendance = async (id, currentAttended) => {
    try {
      await axios.post(import.meta.env.VITE_SERVER_URL + "/applicant_status/update-attended", {
        id,
        attendedAppointment: !currentAttended,
      });

      setScheduledApplicants((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, attended: !currentAttended } : app
        )
      );
      setFilteredApplicants((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, attended: !currentAttended } : app
        )
      );
    } catch (error) {
      console.error("Failed to update attendance:", error.response?.data || error.message);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8 text-blue-700 dark:text-blue-300">
        Scheduled Applicants
      </h1>

      {/* Search and Date Filter */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          className="input input-bordered w-1/4"
          placeholder="Search by Name or Position"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="font-semibold flex items-center ml-auto">
          Schedule Date Filter:
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="flex justify-start mb-4 md:mb-6 lg:mb-8">
        <button
          className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-2 p-2 md:p-3 border rounded-full bg-slate-100 dark:bg-slate-800"
          onClick={fetchScheduledApplicants}
          disabled={loading}
        >
          <RiRefreshFill className="w-5 h-5" />
          <span className="text-sm md:text-base">Refresh</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading scheduled applicants...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">ID</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Full Name</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Email</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Phone Number</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Position</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Scheduled Date</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Attended</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.length > 0 ? (
                currentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.id}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.full_name}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.email}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.phone_number}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.applying_position || "—"}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {new Date(applicant.scheduleDate).toLocaleString()}
                    </td>
                    <td className="text-sm md:text-base">
                      <button
                        onClick={() =>
                          toggleAttendance(applicant.id, applicant.attended)
                        }
                        className={`btn btn-sm ${
                          applicant.attended ? "btn-success" : "btn-error"
                        } text-white`}
                      >
                        {applicant.attended ? "Present" : "Absent"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-gray-500 italic py-4">
                    No applicants found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 md:mt-6 lg:mt-8">
        <nav className="flex items-center">
          <ul className="flex items-center h-8 text-sm">
            <li>
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => paginate(page)}
                  disabled={loading}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === page
                      ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                      : ""
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || loading}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ScheduledApplicants;
