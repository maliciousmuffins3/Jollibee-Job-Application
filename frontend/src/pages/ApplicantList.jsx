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
      alert("No resume file available for this applicant.");
      return;
    }

    const encodedFullName = encodeURIComponent(fullName);
    const encodedFileName = encodeURIComponent(fileName);

    const url = `http://localhost:5000/applicants/file/${encodedFullName}/${encodedFileName}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("File not found");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert("Error fetching file");
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error("Please select a schedule date and time.");
      return;
    }

    for (const applicantId of selectedIds) {
      try {
        await axios.post("http://localhost:5000/applicant_status/set-status", {
          id: applicantId,
          status: "Scheduled",
          schedule_date: scheduleDate,
        });
      } catch (e) {
        console.error("Error scheduling applicant:", applicantId, e);
        toast.error(`Failed to schedule applicant ID ${applicantId}`);
      }
    }

    toast.success("Meeting scheduled for selected applicants.");
    setSelectedIds([]);
    await refreshApplicantList(); // 🔄 Force refresh after scheduling
  };

  const handleReject = async () => {
    // Create a temporary list to store the applicants that are going to be rejected
    const applicantsToReject = selectedIds.map((applicantId) => 
      applicantList.find((applicant) => applicant.id === applicantId)
    );
  
    // Loop through the selected applicants and reject them
    for (const applicant of applicantsToReject) {
      const { id, full_name, email, phone_number } = applicant;
  
      try {
        // Send reject request
        await axios.post("http://localhost:5000/reject/add-reject-applicants", {
          id,
          fullName: full_name,
          email,
          phoneNumber: phone_number,
        });
  
        // Delete applicant from the database
        const deleteUrl = `http://localhost:5000/applicants/delete-applicant?id=${id}&fullName=${full_name}`;
        await axios.delete(deleteUrl);
  
        // Send rejection email
        await axios.get(
          `http://localhost:5000/email/send-reject?email=${encodeURIComponent(email)}`
        );
  
        // Update the state to reflect the changes after rejection
        setApplicantList((prevList) =>
          prevList.filter((applicant) => applicant.id !== id)
        );
  
        setFilteredApplicantList((prevList) =>
          prevList.filter((applicant) => applicant.id !== id)
        );
  
        toast.success(`Applicant ${full_name} rejected successfully.`);
      } catch (e) {
        console.error(`Error rejecting applicant ID ${id}:`, e);
        toast.error(`Failed to reject applicant ID ${id}.`);
      }
    }
  
    // Clear the selected applicant IDs
    setSelectedIds([]);
  };
  

  const refreshApplicantList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/applicants/get-applicants"
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
      toast.error("Failed to refresh applicant list.");
    }
  };

  const fetchApplicantStatus = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/applicant_status/get-applicant-status?id=${id}`
      );
      return res.data?.status || "Applied";
    } catch (e) {
      return "Applied";
    }
  };

  const handleFilter = () => {
    let filtered = applicantList;

    if (searchTerm) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          applicant.applying_position
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (applicant) =>
          new Date(applicant.scheduleDate).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
    }

    setFilteredApplicantList(filtered);
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/applicants/get-applicants"
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
      }
    };

    fetchApplicants();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDate]);

  return (
    <>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">
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
            {filteredApplicantList.map((item) => (
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
                <td>{statusMap[item.id] || "Applied"}</td>
                <td>
                  <button
                    className="btn btn-ghost btn-xs text-blue-600 hover:underline"
                    onClick={() => fetchFile(item.full_name, item.resume)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Date Picker */}
      <div className="mt-6 flex items-center gap-4">
        <label className="font-semibold">Schedule Date:</label>
        <input
          type="datetime-local"
          className="input input-bordered"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4 space-x-3">
        <button
          className="btn btn-success text-white"
          onClick={handleSchedule}
          disabled={selectedIds.length === 0 || !scheduleDate}
        >
          Schedule Meeting
        </button>
        <button
          className="btn btn-error text-white flex items-center gap-1"
          onClick={handleReject}
          disabled={selectedIds.length === 0}
        >
          <RiEjectFill />
          Reject
        </button>
      </div>
    </>
  );
}

export default ApplicantList;
