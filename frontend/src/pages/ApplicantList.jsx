import axios from "axios";
import { useEffect, useState } from "react";
import { RiEjectFill, RiRefreshFill } from "react-icons/ri";
import { toast } from "react-toastify";

function ApplicantList() {
  const [applicantList, setApplicantList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // Only store ids, not full applicant objects
  const [statusMap, setStatusMap] = useState({}); // key: applicant ID, value: status string
  const [scheduleDate, setScheduleDate] = useState(""); // state for schedule date and time

  // Handles checkbox changes
  const handleCheckboxChange = (event, applicantId) => {
    const isChecked = event.target.checked;

    setSelectedIds((prev) =>
      isChecked
        ? [...prev, applicantId] // Add the ID if checked
        : prev.filter((id) => id !== applicantId) // Remove the ID if unchecked
    );
  };

  // Fetch the resume file for the applicant
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

  // Handles scheduling
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

        setStatusMap((prev) => ({ ...prev, [applicantId]: "Scheduled" }));
      } catch (e) {
        console.error("Error scheduling applicant:", applicantId, e);
        toast.error(`Failed to schedule applicant ID ${applicantId}`);
      }
    }

    toast.success("Meeting scheduled for selected applicants.");
    setSelectedIds([]); // Clear selected after scheduling
  };

  // Handles rejection of applicants
  const handleReject = async () => {
    for (const applicantId of selectedIds) {
      const applicant = applicantList.find((a) => a.id === applicantId);
      const { id, full_name, email, phone_number } = applicant;

      try {
        // Step 1: Add to rejected applicants table
        await axios.post("http://localhost:5000/reject/add-reject-applicants", {
          id,
          fullName: full_name,
          email,
          phoneNumber: phone_number,
        });

        // Step 2: Delete from applicant list
        const deleteUrl = `http://localhost:5000/applicants/delete-applicant?id=${id}&fullName=${full_name}`;
        await axios.delete(deleteUrl);

        // Show success toast after rejecting an applicant
        toast.success(`Applicant ${full_name} rejected successfully.`);

        // Remove the rejected applicant from the local state (immediate update)
        setApplicantList((prevList) =>
          prevList.filter((applicant) => applicant.id !== id)
        );
      } catch (e) {
        console.error(`Error rejecting applicant ID ${id}:`, e);
        toast.error(`Failed to reject applicant ID ${id}.`);
      }
    }

    // Clear selected applicants after rejection
    setSelectedIds([]);
  };

  // Refresh the applicant list
  const refreshApplicantList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/applicants/get-applicants"
      );
      setApplicantList(response.data);
    } catch (e) {
      console.error("Error refreshing applicant list:", e);
      toast.error("Failed to refresh applicant list.");
    }
  };

  // Fetch the status of an applicant by ID
  const fetchApplicantStatus = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/applicant_status/get-applicant-status?id=${id}`
      );
      return res.data?.status || "Applied";
    } catch (e) {
      return "Applied"; // fallback if not found or error
    }
  };

  // Fetch applicants and their statuses
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/applicants/get-applicants"
        );
        const applicants = response.data;

        setApplicantList(applicants);

        // Fetch status for each applicant
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

  return (
    <>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">
        Applicants
      </h1>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>
                {/* Refresh Button */}
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
              <th>Status</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applicantList.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.includes(item.id)} // Reflects the selected state
                    onChange={(e) => handleCheckboxChange(e, item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.phone_number}</td>
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
