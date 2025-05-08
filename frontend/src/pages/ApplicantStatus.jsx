import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ApplicantStatusManager() {
  const [applicantList, setApplicantList] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed rows per page
  const [loading, setLoading] = useState(false);

  const fetchApplicantStatus = async (id) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/applicant_status/get-applicant-status?id=${id}`
      );
      return res.data?.status || "Applied";
    } catch {
      return "Applied";
    }
  };

  const handleHire = async () => {
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const applicant = applicantList.find((a) => a.id === id);
          if (!applicant) return;

          const { full_name, email } = applicant;

          // Delete applicant
          await axios.delete(
            import.meta.env.VITE_SERVER_URL + `/applicants/delete-applicant?id=${id}&fullName=${encodeURIComponent(
              full_name
            )}`
          );

          // Send hiring email
          await axios.get(
            import.meta.env.VITE_SERVER_URL + `/email/send-hired?email=${encodeURIComponent(
              email
            )}`
          );
        })
      );

      toast.success(`Hired ${selectedIds.length} applicant(s).`);
      setApplicantList((prevList) =>
        prevList.filter((a) => !selectedIds.includes(a.id))
      );
      setFilteredApplicants((prevList) =>
        prevList.filter((a) => !selectedIds.includes(a.id))
      );
      setSelectedIds([]);
      setCurrentPage(1); // Reset to first page
    } catch (e) {
      console.error("Error hiring applicants:", e);
      toast.error("Failed to hire one or more applicants.");
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + "/applicants/get-applicants");
      const applicants = response.data;
      setApplicantList(applicants);
      setFilteredApplicants(applicants);

      const statusResults = await Promise.all(
        applicants.map((app) => fetchApplicantStatus(app.id))
      );

      const map = {};
      applicants.forEach((app, index) => {
        map[app.id] = statusResults[index];
      });
      setStatusMap(map);
    } catch (e) {
      console.error("Error Fetching Applicants or Status:", e);
      toast.error("Failed to fetch applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleCheckboxChange = (event, applicantId) => {
    const isChecked = event.target.checked;
    setSelectedIds((prev) =>
      isChecked ? [...prev, applicantId] : prev.filter((id) => id !== applicantId)
    );
  };

  const handleSetTraining = async () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          // Set applicant status to 'Training'
          await axios.post(import.meta.env.VITE_SERVER_URL + "/applicant_status/set-status", {
            id,
            status: "Training",
            schedule_date: now,
          });

          // Get the applicant's email
          const applicant = applicantList.find((a) => a.id === id);
          if (applicant && applicant.email) {
            // Send email about the training status
            await axios.get(
              import.meta.env.VITE_SERVER_URL + `/email/send-training?email=${encodeURIComponent(
                applicant.email
              )}`
            );
          }
        })
      );

      toast.success(`Set ${selectedIds.length} applicant(s) to Training.`);
      const updatedMap = { ...statusMap };
      selectedIds.forEach((id) => {
        updatedMap[id] = "Training";
      });
      setStatusMap(updatedMap);
      setSelectedIds([]);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Training update error", error);
      toast.error("Failed to update one or more applicants.");
    }
  };

  const handleReject = async () => {
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const applicant = applicantList.find((a) => a.id === id);
          if (!applicant || !applicant.email) return;

          const { full_name, email, phone_number } = applicant;

          try {
            // Add to rejected list
            await axios.post(import.meta.env.VITE_SERVER_URL + "/reject/add-reject-applicants", {
              id,
              fullName: full_name,
              email,
              phoneNumber: phone_number,
            });

            // Delete original applicant entry
            await axios.delete(
              import.meta.env.VITE_SERVER_URL + `/applicants/delete-applicant?id=${id}&fullName=${encodeURIComponent(
                full_name
              )}`
            );

            // Send rejection email
            await axios.get(
              import.meta.env.VITE_SERVER_URL + `/email/send-reject?email=${encodeURIComponent(
                email
              )}`
            );
          } catch (innerErr) {
            console.warn(
              `Failed to process rejection for applicant ID ${id}:`,
              innerErr
            );
          }
        })
      );

      toast.success(`Rejected ${selectedIds.length} applicant(s).`);
      setApplicantList((prevList) =>
        prevList.filter((a) => !selectedIds.includes(a.id))
      );
      setFilteredApplicants((prevList) =>
        prevList.filter((a) => !selectedIds.includes(a.id))
      );
      setSelectedIds([]);
      setCurrentPage(1); // Reset to first page
    } catch (e) {
      console.error("Error rejecting applicants:", e);
      toast.error("Failed to reject one or more applicants.");
    }
  };

  // Handle the search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredApplicants(applicantList);
    } else {
      const filtered = applicantList.filter((applicant) =>
        Object.values(applicant).some((val) =>
          String(val).toLowerCase().includes(value)
        )
      );
      setFilteredApplicants(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentApplicants = filteredApplicants.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8 text-blue-700 dark:text-blue-300">
        Applicants Status
      </h1>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search applicants..."
          className="input input-bordered w-full md:max-w-xs"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading applicants...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Select</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">ID</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Full Name</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Email</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Phone Number</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.length > 0 ? (
                currentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="text-sm md:text-base">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedIds.includes(applicant.id)}
                        onChange={(e) => handleCheckboxChange(e, applicant.id)}
                      />
                    </td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.id}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.full_name}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.email}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">{applicant.phone_number}</td>
                    <td className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {statusMap[applicant.id] || "Applied"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-gray-500 italic py-4">
                    No applicants found.
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

      {selectedIds.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <button
            className="btn btn-info text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={handleSetTraining}
          >
            Set Selected to Training
          </button>
          <button
            className="btn btn-error text-white bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            onClick={handleReject}
          >
            Reject Selected
          </button>
          <button
            className="btn btn-success text-white bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={handleHire}
          >
            Hire Selected
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplicantStatusManager;
