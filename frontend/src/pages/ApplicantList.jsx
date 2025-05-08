import axios from "axios";
import { useEffect, useState } from "react";
import { RiEjectFill, RiRefreshFill } from "react-icons/ri";
import { toast } from "react-toastify";

function ApplicantList() {
  const [applicantList, setApplicantList] = useState([]);
  const [filteredApplicantList, setFilteredApplicantList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [scheduleDate, setScheduleDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 30;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedApplicants = filteredApplicantList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredApplicantList.length / rowsPerPage);

  const handleCheckboxChange = (event, applicantId) => {
    const isChecked = event.target.checked;
    setSelectedIds((prev) =>
      isChecked
        ? [...prev, applicantId]
        : prev.filter((id) => id !== applicantId)
    );
  };

  async function fetchFile(fullName, fileName) {
    if (!fileName) {
      toast.warn("No resume file available for this applicant.");
      return;
    }

    const encodedFullName = encodeURIComponent(fullName);
    const encodedFileName = encodeURIComponent(fileName);

    const url = import.meta.env.VITE_SERVER_URL + `/applicants/file/${encodedFullName}/${encodedFileName}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const message = `An error occurred while fetching the file: ${res.status}`;
        throw new Error(message);
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error fetching file:", err);
      toast.error("Error fetching file.");
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error("Please select a schedule date and time.");
      return;
    }

    for (const applicantId of selectedIds) {
      try {
        await axios.post(import.meta.env.VITE_SERVER_URL + "/applicant_status/set-status", {
          id: applicantId,
          status: "Scheduled",
          schedule_date: scheduleDate,
        });
        toast.success(`Meeting scheduled for applicant ID ${applicantId}.`);
      } catch (e) {
        console.error("Error scheduling applicant:", applicantId, e);
        toast.error(`Failed to schedule applicant ID ${applicantId}.`);
      }
    }

    setSelectedIds([]);
    setScheduleDate(""); // Clear schedule date after scheduling
    await refreshApplicantList(); // 🔄 Force refresh after scheduling
  };

  const handleReject = async () => {
    if (selectedIds.length === 0) {
      toast.warn("Please select applicants to reject.");
      return;
    }

    for (const applicantId of selectedIds) {
      const applicantToReject = applicantList.find((applicant) => applicant.id === applicantId);
      if (applicantToReject) {
        const { id, full_name, email, phone_number } = applicantToReject;
        try {
          await axios.post(import.meta.env.VITE_SERVER_URL + "/reject/add-reject-applicants", {
            id,
            fullName: full_name,
            email,
            phoneNumber: phone_number,
          });

          const deleteUrl = import.meta.env.VITE_SERVER_URL + `/applicants/delete-applicant?id=${id}&fullName=${encodeURIComponent(full_name)}`;
          await axios.delete(deleteUrl);

          await axios.get(
            import.meta.env.VITE_SERVER_URL + `/email/send-reject?email=${encodeURIComponent(email)}`
          );

          setApplicantList((prevList) =>
            prevList.filter((applicant) => applicant.id !== id)
          );

          setFilteredApplicantList((prevList) =>
            prevList.filter((applicant) => applicant.id !== id)
          );

          toast.success(`Applicant ${full_name} rejected successfully.`);
        } catch (e) {
          console.error(`Error rejecting applicant ID ${id}:`, e);
          toast.error(`Failed to reject applicant ${full_name}.`);
        }
      }
    }
    setSelectedIds([]);
  };

  const refreshApplicantList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/applicants/get-applicants"
      );
      const applicants = response.data;
      setApplicantList(applicants);
      setFilteredApplicantList(applicants);

      const statusResults = await Promise.all(
        applicants.map((app) => fetchApplicantStatus(app.id))
      );
      const map = {};
      applicants.forEach((app, index) => {
        map[app.id] = statusResults[index];
      });
      setStatusMap(map);
    } catch (e) {
      console.error("Error refreshing applicant list:", e);
      setError("Failed to refresh applicant list.");
      toast.error("Failed to refresh applicant list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantStatus = async (id) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/applicant_status/get-applicant-status?id=${id}`
      );
      return res.data || { status: "Applied" }; // Ensure we always return an object
    } catch (e) {
      console.error(`Error fetching status for applicant ${id}:`, e);
      return { status: "Applied" };
    }
  };

  const handleFilter = () => {
    let filtered = applicantList;

    if (searchTerm) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.applying_position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (applicant) => {
          const applicantStatus = statusMap[applicant.id];
          if (applicantStatus && applicantStatus.schedule_date) {
            const applicantScheduleDate = new Date(applicantStatus.schedule_date);
            const filterDate = new Date(selectedDate);
            return applicantScheduleDate.toLocaleDateString() === filterDate.toLocaleDateString();
          }
          return false; // If no schedule date, it doesn't match the filter
        }
      );
    }

    setFilteredApplicantList(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  useEffect(() => {
    const fetchInitialApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_URL + "/applicants/get-applicants"
        );
        const applicants = response.data;
        setApplicantList(applicants);
        setFilteredApplicantList(applicants);

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
        setError("Failed to fetch applicant data.");
        toast.error("Failed to fetch applicant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialApplicants();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDate]);

  if (loading) {
    return <div className="text-center py-10">Loading applicants...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 lg:mb-8 text-blue-700 dark:text-blue-300">
        Applicants
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

      <div className="overflow-x-auto">
        <table className="table text-center min-w-full table-auto">
          <thead>
            <tr>
              <th>
                <div className="flex justify-center">
                  <button
                    className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-2 p-2 border rounded-full"
                    onClick={refreshApplicantList}
                    disabled={loading}
                  >
                    <RiRefreshFill />
                  </button>
                </div>
              </th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => handleCheckboxChange(e, item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.phone_number}</td>
                <td>{item.applying_position || "—"}</td>
                <td>{statusMap[item.id]?.status || "Applied"}</td>
                <td>
                  <button
                    className="btn btn-ghost btn-xs text-blue-600 hover:underline"
                    onClick={() => fetchFile(item.full_name, item.resume)}
                    disabled={loading}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span className="mx-4 mt-1 px-3 bg-slate-800 rounded-full flex self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>

      {/* Schedule Date Picker */}
      <div className="mt-6 flex items-center gap-4">
        <label className="font-semibold">Schedule Date:</label>
        <input
          type="datetime-local"
          className="input input-bordered"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4 space-x-3">
        <button
          className="btn btn-success text-white"
          onClick={handleSchedule}
          disabled={selectedIds.length === 0 || !scheduleDate || loading}
        >
          Schedule Meeting
        </button>
        <button
          className="btn btn-error text-white flex items-center gap-1"
          onClick={handleReject}
          disabled={selectedIds.length === 0 || loading}
        >
          <RiEjectFill />
          Reject
        </button>
      </div>
    </>
  );
}

export default ApplicantList;