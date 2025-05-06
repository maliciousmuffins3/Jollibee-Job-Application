import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ApplicantStats() {
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [scheduledApplicants, setScheduledApplicants] = useState(0);
  const [rejectedApplicants, setRejectedApplicants] = useState(0);
  const [trainingApplicants, setTrainingApplicants] = useState(0);
  const [scheduledList, setScheduledList] = useState([]);
  const [trainingList, setTrainingList] = useState([]);

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
      setScheduledList(scheduled);
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
      setTrainingList(training);
    } catch (error) {
      toast.error("Failed to fetch training applicants.");
      console.error(error);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    fetchTotalApplicants();
    fetchScheduledApplicants();
    fetchRejectedApplicants();
    fetchTrainingApplicants();
  };


  const generatePDFReport = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
  
    doc.setFontSize(18);
    doc.text("Applicant Report Summary", marginLeft, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, marginLeft, 30);
  
    // Summary table
    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Count"]],
      body: [
        ["Total Applicants", totalApplicants],
        ["Scheduled", scheduledApplicants],
        ["Training", trainingApplicants],
        ["Rejected", rejectedApplicants],
      ],
      columnStyles: {
        0: { halign: 'center' }, // Centering the first column
        1: { halign: 'center' }, // Centering the second column
      },
      headStyles: {
        halign: 'center', // Centering the header text
      },
    });
  
    let finalY = doc.lastAutoTable.finalY || 50;
  
    // Scheduled Applicants section
    doc.setFontSize(14);
    doc.text("Scheduled Applicants", marginLeft, finalY + 10);
    autoTable(doc, {
      startY: finalY + 14,
      head: [["ID", "Schedule Date", "Attended Appointment"]],
      body: scheduledList.map((applicant) => [
        applicant.id,
        new Date(applicant.schedule_date).toLocaleString(),
        applicant.attended_appointment ? "Yes" : "No",
      ]),
      theme: "striped",
      columnStyles: {
        0: { halign: 'center' }, // Centering the ID column
        1: { halign: 'center' }, // Centering the Schedule Date column
        2: { halign: 'center' }, // Centering the Attended Appointment column
      },
      headStyles: {
        halign: 'center', // Centering the header text for this table
      },
    });
  
    finalY = doc.lastAutoTable.finalY;
  
    // Training Applicants section
    doc.setFontSize(14);
    doc.text("Training Applicants", marginLeft, finalY + 10);
    autoTable(doc, {
      startY: finalY + 14,
      head: [["ID", "Schedule Date", "Attended Appointment"]],
      body: trainingList.map((applicant) => [
        applicant.id,
        new Date(applicant.schedule_date).toLocaleString(),
        applicant.attended_appointment ? "Yes" : "No",
      ]),
      theme: "striped",
      columnStyles: {
        0: { halign: 'center' }, // Centering the ID column
        1: { halign: 'center' }, // Centering the Schedule Date column
        2: { halign: 'center' }, // Centering the Attended Appointment column
      },
      headStyles: {
        halign: 'center', // Centering the header text for this table
      },
    });
  
    doc.save("applicant_report.pdf");
  };
  

  const pieData = [
    { name: "Total", value: totalApplicants },
    { name: "Scheduled", value: scheduledApplicants },
    { name: "Training", value: trainingApplicants },
    { name: "Rejected", value: rejectedApplicants },
  ];

  const COLORS = ["#6b7280", "#3b82f6", "#10b981", "#ef4444"];

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

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Distribution Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={refreshStats}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
        >
          Refresh Stats
        </button>
        <button
          onClick={generatePDFReport}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300"
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}

export default ApplicantStats;
