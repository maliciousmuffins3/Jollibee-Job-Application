import { useEffect, useState } from "react";
import axios from "axios";
import { RiRefreshFill } from "react-icons/ri";

function ScheduledApplicants() {
  const [scheduledApplicants, setScheduledApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchScheduledApplicants = async () => {
    try {
      const statusRes = await axios.get(
        "http://localhost:5000/applicant_status/get-all-applicant-status"
      );

      const scheduledEntries = statusRes.data.filter(
        (entry) => entry.status === "Scheduled"
      );

      const applicantRes = await axios.get(
        "http://localhost:5000/applicants/get-applicants"
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
    } catch (error) {
      console.error("Failed to fetch scheduled applicants:", error);
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
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedDate]);

  const toggleAttendance = async (id, currentAttended) => {
    try {
      await axios.post("http://localhost:5000/applicant_status/update-attended", {
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

  return (
    <div>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">
        Scheduled Applicants
      </h1>

      <div className="mb-4 flex justify-between gap-4">
        <input
          type="text"
          className="input input-bordered w-1/4"
          placeholder="Search by Position or Name"
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

      <div className="flex justify-start mb-4">
        <button
          className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-1 p-3 border rounded-full bg-slate-800"
          onClick={fetchScheduledApplicants}
        >
          <RiRefreshFill />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Scheduled Date</th>
              <th>Attended</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.id}</td>
                <td>{applicant.full_name}</td>
                <td>{applicant.email}</td>
                <td>{applicant.phone_number}</td>
                <td>{applicant.applying_position || "—"}</td>
                <td>{new Date(applicant.scheduleDate).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() =>
                      toggleAttendance(applicant.id, applicant.attended)
                    }
                    className={`btn btn-sm ${
                      applicant.attended ? "btn-success" : "btn-error"
                    }`}
                  >
                    {applicant.attended ? "Present" : "Absent"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredApplicants.length === 0 && (
              <tr>
                <td colSpan={7} className="text-gray-500 italic">
                  No applicants found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduledApplicants;
