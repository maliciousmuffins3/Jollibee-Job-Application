import { useEffect, useState } from "react";
import axios from "axios";
import { RiRefreshFill } from "react-icons/ri"; // For the refresh icon

function ScheduledApplicants() {
  const [scheduledApplicants, setScheduledApplicants] = useState([]);

  // Function to fetch scheduled applicants
  const fetchScheduledApplicants = async () => {
    try {
      // Step 1: Get all statuses, including the scheduled date
      const statusRes = await axios.get(
        "http://localhost:5000/applicant_status/get-all-applicant-status"
      );

      const scheduledEntries = statusRes.data.filter(
        (entry) => entry.status === "Scheduled"
      );

      // Step 2: Get all applicants
      const applicantRes = await axios.get(
        "http://localhost:5000/applicants/get-applicants"
      );
      const allApplicants = applicantRes.data;

      // Step 3: Combine the status with the applicant's details
      const scheduled = allApplicants
        .map((app) => {
          const status = scheduledEntries.find(
            (entry) => entry.id === app.id
          );
          return status ? { ...app, scheduleDate: status.schedule_date } : null;
        })
        .filter(Boolean); // Filter out applicants without a schedule date

      setScheduledApplicants(scheduled);
    } catch (error) {
      console.error("Failed to fetch scheduled applicants:", error);
    }
  };

  // UseEffect to fetch data on initial load
  useEffect(() => {
    fetchScheduledApplicants();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">
        Scheduled Applicants
      </h1>

      {/* Refresh Button */}
      <div className="flex justify-start mb-4">
        <button
          className="btn btn-ghost text-xl text-blue-600 hover:underline flex items-center gap-1 p-3 border rounded-full bg-slate-800 "
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
              <th>Scheduled Date</th>
            </tr>
          </thead>
          <tbody>
            {scheduledApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.id}</td>
                <td>{applicant.full_name}</td>
                <td>{applicant.email}</td>
                <td>{applicant.phone_number}</td>
                <td>{new Date(applicant.scheduleDate).toLocaleString()}</td>
              </tr>
            ))}
            {scheduledApplicants.length === 0 && (
              <tr>
                <td colSpan={5} className="text-gray-500 italic">
                  No scheduled applicants found.
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
