import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ApplicantStatusManager() {
  const [applicantList, setApplicantList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const fetchApplicantStatus = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/applicant_status/get-applicant-status?id=${id}`
      );
      return res.data?.status || "Applied";
    } catch {
      return "Applied";
    }
  };

  const fetchApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/applicants/get-applicants");
      const applicants = response.data;
      setApplicantList(applicants);

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
        selectedIds.map((id) =>
          axios.post("http://localhost:5000/applicant_status/set-status", {
            id,
            status: "Training",
            schedule_date: now,
          })
        )
      );

      toast.success(`Set ${selectedIds.length} applicant(s) to Training.`);
      const updatedMap = { ...statusMap };
      selectedIds.forEach((id) => {
        updatedMap[id] = "Training";
      });
      setStatusMap(updatedMap);
      setSelectedIds([]);
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
          const { full_name, email, phone_number } = applicant;

          await axios.post("http://localhost:5000/reject/add-reject-applicants", {
            id,
            fullName: full_name,
            email,
            phoneNumber: phone_number,
          });

          await axios.delete(
            `http://localhost:5000/applicants/delete-applicant?id=${id}&fullName=${full_name}`
          );
        })
      );

      toast.success(`Rejected ${selectedIds.length} applicant(s).`);
      setApplicantList((prevList) =>
        prevList.filter((a) => !selectedIds.includes(a.id))
      );
      setSelectedIds([]);
    } catch (e) {
      console.error("Error rejecting applicants:", e);
      toast.error("Failed to reject one or more applicants.");
    }
  };

  return (
    <>
      <h1 className="font-bold text-[clamp(2rem,5vw,2.5rem)] mb-4">Applicants</h1>

      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applicantList.map((applicant) => (
              <tr key={applicant.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.includes(applicant.id)}
                    onChange={(e) => handleCheckboxChange(e, applicant.id)}
                  />
                </td>
                <td>{applicant.id}</td>
                <td>{applicant.full_name}</td>
                <td>{applicant.email}</td>
                <td>{applicant.phone_number}</td>
                <td>{statusMap[applicant.id] || "Applied"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex gap-4">
          <button
            className="btn btn-info text-white"
            onClick={handleSetTraining}
          >
            Set Selected to Training
          </button>
          <button
            className="btn btn-error text-white"
            onClick={handleReject}
          >
            Reject Selected
          </button>
        </div>
      )}
    </>
  );
}

export default ApplicantStatusManager;
