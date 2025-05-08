import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import Jollibee logo (replace with actual path or URL)
// const jollibeeLogo = 'https://brandslogos.com/wp-content/uploads/thumbs/jollibee-logo-vector.svg'; // public URL
import jollibeeLogo from '../assets/jolllibee-logo-with-text.png'; // Local import  - make sure the path is correct!

const ApplicantStats = () => {
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [scheduledApplicants, setScheduledApplicants] = useState(0);
    const [rejectedApplicants, setRejectedApplicants] = useState(0);
    const [trainingApplicants, setTrainingApplicants] = useState(0);
    const [scheduledList, setScheduledList] = useState([]);
    const [trainingList, setTrainingList] = useState([]);
    const [reportStartDate, setReportStartDate] = useState('');
    const [reportEndDate, setReportEndDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [loading, setLoading] = useState(false);

    // Helper function to fetch data with date range
    const fetchData = async (
        endpoint,
        setData,
        errorMessage,
        processData
    ) => {
        setLoading(true);
        try {
            let url = import.meta.env.VITE_SERVER_URL + `/${endpoint}`;
            if (reportStartDate && reportEndDate) {
                url += `?startDate=${reportStartDate}&endDate=${reportEndDate}`;
            }
            const res = await axios.get(url);
            let data = res.data;
            if (processData) {
                data = processData(data);
            }
            setData(data);
        } catch (error) {
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalApplicants = () => {
        fetchData(
            'applicants/get-applicants',
            (data) => setTotalApplicants(data.length),
            'Failed to fetch total applicants.'
        );
    };

    const fetchScheduledApplicants = () => {
        fetchData(
            'applicant_status/get-all-applicant-status',
            (data) => {
                const scheduled = data.filter((app) => app.status === 'Scheduled');
                setScheduledApplicants(scheduled.length);
                setScheduledList(scheduled);
            },
            'Failed to fetch scheduled applicants.'
        );
    };

    const fetchRejectedApplicants = () => {
        fetchData(
            'reject/get-all-rejected-applicants',
            (data) => setRejectedApplicants(data.length),
            'Failed to fetch rejected applicants.'
        );
    };

    const fetchTrainingApplicants = () => {
        fetchData(
            'applicant_status/get-all-applicant-status',
            (data) => {
                const training = data.filter((app) => app.status === 'Training');
                setTrainingApplicants(training.length);
                setTrainingList(training);
            },
            'Failed to fetch training applicants.'
        );
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
        if (reportStartDate && reportEndDate) {
            const start = new Date(reportStartDate);
            const end = new Date(reportEndDate);
            if (start > end) {
                setDateError('End date cannot be earlier than start date.');
                return;
            }
            setDateError('');
        }

        const doc = new jsPDF();
        const marginLeft = 14;
        const marginTop = 10;
        const pageWidth = doc.internal.pageSize.width;

        // Add Jollibee logo
        if (jollibeeLogo) {
            doc.addImage(jollibeeLogo, 'JPEG', marginLeft + 80, marginTop + 5, 20, 20);
        }

        // Add Report title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        const title =
            reportStartDate && reportEndDate
                ? `Applicant Report Summary from ${new Date(
                    reportStartDate
                ).toLocaleDateString()} to ${new Date(
                    reportEndDate
                ).toLocaleDateString()}`
                : 'Applicant Report Summary';
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth / 2) - (titleWidth / 2);
        doc.text(title, titleX, marginTop + 35);

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, marginLeft, marginTop + 50);


        // Summary table
        autoTable(doc, {
            startY: marginTop + 60,
            head: [['Metric', 'Count']],
            body: [
                ['Total Applicants', totalApplicants],
                ['Scheduled', scheduledApplicants],
                ['Training', trainingApplicants],
                ['Rejected', rejectedApplicants],
            ],
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'center' },
            },
            headStyles: {
              halign: 'center',
              fillColor: '#FF0000' // Make the header row red
          },
        });

        let finalY = doc.lastAutoTable.finalY || marginTop + 70;

        // Scheduled Applicants section
        doc.setFontSize(14);
        doc.text('Scheduled Applicants', marginLeft, finalY + 10);
        const scheduledData = scheduledList.filter((applicant) => {
            if (reportStartDate && reportEndDate) {
                const scheduleDate = new Date(applicant.schedule_date);
                const start = new Date(reportStartDate);
                const end = new Date(reportEndDate);
                return scheduleDate >= start && scheduleDate <= end;
            }
            return true;
        });

        autoTable(doc, {
            startY: finalY + 14,
            head: [['ID', 'Schedule Date', 'Attended Appointment']],
            body: scheduledData.map((applicant) => [
                applicant.id,
                new Date(applicant.schedule_date).toLocaleString(),
                applicant.attended_appointment ? 'Yes' : 'No',
            ]),
            theme: 'striped',
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'center' },
                2: { halign: 'center' },
            },
            headStyles: {
              halign: 'center',
              fillColor: '#FF0000' // Make the header row red
          },
        });

        finalY = doc.lastAutoTable.finalY;

        // Training Applicants section
        doc.setFontSize(14);
        doc.text('Training Applicants', marginLeft, finalY + 10);
        const trainingData = trainingList.filter((applicant) => {
            if (reportStartDate && reportEndDate) {
                const scheduleDate = new Date(applicant.schedule_date);
                const start = new Date(reportStartDate);
                const end = new Date(reportEndDate);
                return scheduleDate >= start && scheduleDate <= end;
            }
            return true;
        });
        autoTable(doc, {
            startY: finalY + 14,
            head: [['ID', 'Name', 'Position']],
            body: trainingData.map((applicant) => [
                applicant.id,
                applicant.name,
                applicant.position
            ]),
            theme: 'striped',
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'center' },
                2: { halign: 'center' },
            },
            headStyles: {
              halign: 'center',
              fillColor: '#FF0000' // Make the header row red
          },
        });

        doc.save('applicant_report.pdf');
    };

    const pieData = [
        { name: 'Total', value: totalApplicants },
        { name: 'Scheduled', value: scheduledApplicants },
        { name: 'Training', value: trainingApplicants },
        { name: 'Rejected', value: rejectedApplicants },
    ];

    const COLORS = ['#6b7280', '#3b82f6', '#10b981', '#ef4444'];

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Applicant Overview
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-gray-800 text-white rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-200">
                        Total Applicants
                    </h2>
                    <p className="text-2xl md:text-4xl font-mono text-center">{totalApplicants}</p>
                </div>

                <div className="bg-blue-800 text-white rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-200">
                        Scheduled
                    </h2>
                    <p className="text-2xl md:text-4xl font-mono text-center">{scheduledApplicants}</p>
                </div>

                <div className="bg-green-800 text-white rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-200">
                        In Training
                    </h2>
                    <p className="text-2xl md:text-4xl font-mono text-center">{trainingApplicants}</p>
                </div>

                <div className="bg-red-800 text-white rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-200">
                        Rejected
                    </h2>
                    <p className="text-2xl md:text-4xl font-mono text-center">{rejectedApplicants}</p>
                </div>
            </div>

            <div className="mt-8 md:mt-12">
                <h2 className="text-xl md:text-2xl font-semibold mb-4  md:mb-6 text-gray-300 text-center">
                    Distribution Chart
                </h2>
                <ResponsiveContainer width="100%" height={300} md:height={350}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100} md:outerRadius={120}
                            dataKey="value"
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#333',
                                color: '#fff',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            wrapperStyle={{
                                marginTop: '10px', md: '20px',
                                textAlign: 'center',
                                color: '#9ca3af',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-start">
                <div className="flex flex-col gap-2 md:gap-3 w-full sm:w-auto">
                    <label className="font-semibold text-gray-300 text-sm md:text-base">
                        Report Start Date:
                    </label>
                    <input
                        type="date"
                        className="w-full rounded-md border-gray-700 bg-gray-800 text-white p-2 text-sm md:text-base"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 md:gap-3 w-full sm:w-auto">
                    <label className="font-semibold text-gray-300 text-sm md:text-base">Report End Date:</label>
                    <input
                        type="date"
                        className="w-full rounded-md border-gray-700 bg-gray-800 text-white p-2 text-sm md:text-base"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                    />
                    {dateError && (
                        <p className="text-red-500 text-xs md:text-sm mt-1 md:mt-2">{dateError}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-6 justify-center w-full sm:w-auto">
                <button
                    onClick={refreshStats}
                    className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 border-blue-500/50 rounded-md px-4 py-2 md:px-6 md:py-2 transition-colors duration-200 w-full sm:w-auto text-sm md:text-base"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh Stats'}
                </button>
                <button
                    onClick={generatePDFReport}
                    className="bg-green-500/20 text-green-300 hover:bg-green-500/30 hover:text-green-200 border-green-500/50 rounded-md px-4 py-2 md:px-6 md:py-2 transition-colors duration-200 w-full sm:w-auto text-sm md:text-base"
                    disabled={loading}
                >
                    Download Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default ApplicantStats;