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
  const [searchTerm, setSearchTerm] = useState(""); // state for search term

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
    try {
      const response = await axios.get("http://localhost:5000/applicants/get-applicants");
      setApplicants(response.data);
      setFilteredApplicants(response.data); // Set filtered applicants initially
    } catch (error) {
      toast.error("Failed to fetch applicants.");
      console.error(error);
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
        `http://localhost:5000/applicant_documents/get-document?id=${applicant.id}`
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
      await axios.post("http://localhost:5000/applicant_documents/set-documents", {
        id: selectedApplicant.id,
        ...docData,
      });
      toast.success(`Documents saved for ${selectedApplicant.full_name}`);
      closeDialogs();
    } catch (error) {
      toast.error("Failed to save documents.");
    }
  };

  // Handle the search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      // If search term is empty, show all applicants
      setFilteredApplicants(applicants);
    } else {
      // Filter applicants based on the search term
      const filtered = applicants.filter((applicant) =>
        Object.values(applicant).some((val) =>
          String(val).toLowerCase().includes(value)
        )
      );
      setFilteredApplicants(filtered);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">Applicant Documents</h1>

      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search applicants..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={handleSearch}
        />

        <button
          className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-2 p-2 border rounded-full"
          onClick={fetchApplicants}
        >
          <RiRefreshFill />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.id}</td>
                  <td>{applicant.full_name}</td>
                  <td>{applicant.email}</td>
                  <td>{applicant.phone_number}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm text-blue-500 hover:underline"
                      onClick={() => openSetDialog(applicant)}
                    >
                      <RiFileList3Fill className="inline-block mr-1" /> Set
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm text-green-500 hover:underline"
                      onClick={() => openViewDialog(applicant)}
                    >
                      <RiEyeFill className="inline-block mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-gray-500 italic">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Set Dialog */}
      {isSetDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral text-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Set Documents for {selectedApplicant?.full_name}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <button className="btn btn-outline btn-sm" onClick={closeDialogs}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
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
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
        Documents for {selectedApplicant?.full_name}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(viewLabels).map(([key, label]) => {
          const present = existingDocs[key];
          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg shadow-md ${
                present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
              }`}
            >
              <span className="font-medium">{label}</span>
              <span className="text-sm font-semibold">
                {present ? "✔ Present" : "✘ Missing"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        <button className="btn btn-outline btn-sm" onClick={closeDialogs}>
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
