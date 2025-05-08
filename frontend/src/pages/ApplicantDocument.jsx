import { useEffect, useState } from "react";
import axios from "axios";
import { RiFileList3Fill, RiRefreshFill, RiEyeFill } from "react-icons/ri";
import { toast } from "react-toastify";

function ApplicantDocumentsManager() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [docData, setDocData] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [isSetDialogOpen, setIsSetDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed rows per page
  const [loading, setLoading] = useState(false); // Added loading state

  const documentLabels = {
    sss: "SSS",
    pagIbig: "Pag-IBIG",
    healthCard: "Health Card",
    medicalResult: "Medical Result",
    drugTest: "Drug Test",
    bloodTest: "Blood Test",
    nbi: "NBI Clearance",
    mayorsPermit: "Mayor's Permit",
    tinNumber: "TIN Number",
  };

  const viewLabels = {
    SSS: "SSS",
    PAG_IBIG: "Pag-IBIG",
    Health_Card: "Health Card",
    Medical_Result: "Medical Result",
    Drug_Test: "Drug Test",
    Blood_Test: "Blood Test",
    NBI: "NBI Clearance",
    Mayors_Permit: "Mayor's Permit",
    Tin_Number: "TIN Number",
  };

  const fetchApplicants = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + "/applicants/get-applicants");
      setApplicants(response.data);
      setFilteredApplicants(response.data);
    } catch (error) {
      toast.error("Failed to fetch applicants.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const openSetDialog = (applicant) => {
    setSelectedApplicant(applicant);
    setDocData({
      sss: false,
      pagIbig: false,
      healthCard: false,
      medicalResult: false,
      drugTest: false,
      bloodTest: false,
      nbi: false,
      mayorsPermit: false,
      tinNumber: false,
    });
    setIsSetDialogOpen(true);
  };

  const openViewDialog = async (applicant) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/applicant_documents/get-document?id=${applicant.id}`
      );
      setExistingDocs(res.data);
      setSelectedApplicant(applicant);
      setIsViewDialogOpen(true);
    } catch (err) {
      toast.error("Failed to fetch document details.");
    }
  };

  const closeDialogs = () => {
    setIsSetDialogOpen(false);
    setIsViewDialogOpen(false);
    setSelectedApplicant(null);
    setDocData({});
    setExistingDocs({});
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDocData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(import.meta.env.VITE_SERVER_URL + "/applicant_documents/set-documents", {
        id: selectedApplicant.id,
        ...docData,
      });
      toast.success(`Documents saved for ${selectedApplicant.full_name}`);
      closeDialogs();
    } catch (error) {
      toast.error("Failed to save documents.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter((applicant) =>
        Object.values(applicant).some((val) =>
          String(val).toLowerCase().includes(value)
        )
      );
      setFilteredApplicants(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8 text-blue-700 dark:text-blue-300">Applicant Documents</h1>

      <div className="flex justify-between items-center mb-4 md:mb-6 lg:mb-8">
        <input
          type="text"
          placeholder="Search applicants..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-2 p-2 md:p-3 border rounded-full bg-slate-100 dark:bg-slate-800"
          onClick={fetchApplicants}
          disabled={loading}
        >
          <RiRefreshFill className="w-5 h-5" />
          <span className="text-sm md:text-base">Refresh</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading applicants...</p> // Show loading message
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">ID</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Full Name</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Email</th>
                <th className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Phone</th>
                <th colSpan={2} className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">Actions</th>
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
                    <td>
                      <button
                        className="btn btn-ghost btn-sm text-blue-500 hover:underline flex items-center gap-2"
                        onClick={() => openSetDialog(applicant)}
                      >
                        <RiFileList3Fill className="w-4 h-4" /> <span className="text-xs md:text-sm">Set</span>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm text-green-500 hover:underline flex items-center gap-2"
                        onClick={() => openViewDialog(applicant)}
                      >
                        <RiEyeFill className="w-4 h-4" /> <span className="text-xs md:text-sm">View</span>
                      </button>
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

      {/* Set Dialog */}
      {isSetDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral text-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Set Documents for {selectedApplicant?.full_name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {Object.entries(documentLabels).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    name={key}
                    checked={docData[key] || false}
                    onChange={handleCheckboxChange}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline btn-sm text-white hover:bg-gray-700" onClick={closeDialogs}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Dialog */}
      {isViewDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 text-base-content p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2 text-blue-700 dark:text-blue-300">
              Documents for {selectedApplicant?.full_name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(viewLabels).map(([key, label]) => {
                const present = existingDocs[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-lg shadow-md ${
                      present ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
                    <span className="text-sm font-semibold">
                      {present ? <span className="text-green-600 dark:text-green-400">✔ Present</span> : <span className="text-red-600 dark:text-red-400">✘ Missing</span>}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button className="btn btn-outline btn-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700" onClick={closeDialogs}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantDocumentsManager;
