import { FileText, IdCard, Calendar, GraduationCap, CheckCircle, Bell } from "lucide-react";
import profileSample from '../assets/profileSample.png';

function Profile({ name, role, applicantId }) {
    return (
        <div className="flex flex-col items-center text-center gap-4 w-full">
            <img
            src={profileSample}
            alt="Profile"
            className="rounded-full w-16 h-16 border border-gray-500"
            />
            <h2 className="text-2xl font-semibold text-gray-200">{name}</h2>
            <p className="text-gray-400">Applying for: {role}</p>
            <div className="px-3 py-1 rounded-full bg-blood text-white text-sm font-medium">
                Applicant ID: {applicantId}
            </div>
        </div>
    );
}

function DocumentChecklist({ title, documents, iconColor = "text-gray-400" }) {
    return (
        <div className="w-full text-left">
            <h3 className={`text-lg font-semibold ${iconColor === "text-error" ? "text-error" : "text-gray-300"}`}>{title}</h3>
            <ul className="space-y-2 mt-2">
                {documents.map((doc, index) => (
                    <li key={index} className={`flex items-center gap-2 ${iconColor}`}>
                        {doc.icon} {doc.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ApplicantDocumentCard() {
    const requiredDocs = [
        { icon: <FileText size={20} />, label: "Resume" },
        { icon: <IdCard size={20} />, label: "ID" },
        { icon: <Calendar size={20} />, label: "Birth Certificate" }
    ];

    const optionalDocs = [
        { icon: <GraduationCap size={20} />, label: "Diploma" },
        { icon: <CheckCircle size={20} />, label: "Certificates" }
    ];

    const handleNotify = () => {
        alert("Notification sent to the applicant!");  // Replace with actual notification logic
    };

    return (
        <div className="w-full max-w-md p-6 shadow-lg border border-gray-700 rounded-2xl bg-gray-800 text-gray-300 flex flex-col">
            {/* Profile Section */}
            <Profile name="Matthew Roxas" role="Software Engineer" applicantId="123456" />

            {/* Document Lists */}
            <div className="mt-6 space-y-4 flex-1">
                <DocumentChecklist title="Documents Required:" documents={requiredDocs} iconColor="text-error" />
                <DocumentChecklist title="Optional Documents:" documents={optionalDocs} />
            </div>

            {/* Notify Button (Bottom-Right) */}
            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleNotify} 
                    className="text-primary hover:text-primary/80 transition flex items-center"
                >
                    <Bell size={18} className="mr-1" /> Notify This Person
                </button>
            </div>
        </div>
    );
}

export default ApplicantDocumentCard;
