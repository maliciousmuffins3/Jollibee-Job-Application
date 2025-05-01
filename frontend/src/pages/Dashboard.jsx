import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ApplicantStats() {
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [scheduledApplicants, setScheduledApplicants] = useState(0);
  const [rejectedApplicants, setRejectedApplicants] = useState(0);
  const [trainingApplicants, setTrainingApplicants] = useState(0);

  const fetchTotalApplicants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/applicants/get-applicants");
      setTotalApplicants(res.data.length);
    } catch (error) {
      toast.error("Failed to fetch total applicants.");
      console.error(error);
    }
  };

  const fetchScheduledApplicants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/applicant_status/get-all-applicant-status");
      const scheduled = res.data.filter((app) => app.status === "Scheduled");
      setScheduledApplicants(scheduled.length);
    } catch (error) {
      toast.error("Failed to fetch scheduled applicants.");
      console.error(error);
    }
  };

  const fetchRejectedApplicants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reject/get-all-rejected-applicants");
      setRejectedApplicants(res.data.length);
    } catch (error) {
      toast.error("Failed to fetch rejected applicants.");
      console.error(error);
    }
  };

  const fetchTrainingApplicants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/applicant_status/get-all-applicant-status");
      const training = res.data.filter((app) => app.status === "Training");
      setTrainingApplicants(training.length);
    } catch (error) {
      toast.error("Failed to fetch training applicants.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTotalApplicants();
    fetchScheduledApplicants();
    fetchRejectedApplicants();
    fetchTrainingApplicants();
  }, []);

  const refreshStats = () => {
    fetchTotalApplicants();
    fetchScheduledApplicants();
    fetchRejectedApplicants();
    fetchTrainingApplicants();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Applicant Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Total Applicants</h2>
          <p className="text-4xl font-mono">{totalApplicants}</p>
        </div>
        <div className="bg-blue-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Scheduled</h2>
          <p className="text-4xl font-mono">{scheduledApplicants}</p>
        </div>
        <div className="bg-green-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">In Training</h2>
          <p className="text-4xl font-mono">{trainingApplicants}</p>
        </div>
        <div className="bg-red-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Rejected</h2>
          <p className="text-4xl font-mono">{rejectedApplicants}</p>
        </div>
      </div>

      {/* ✅ Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={refreshStats}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
        >
          Refresh Stats
        </button>
      </div>
    </div>
  );
}

export default ApplicantStats;
