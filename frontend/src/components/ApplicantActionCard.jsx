import { Phone, Mail, Calendar, Star, FileText, FolderOpen } from "lucide-react";
import profileSample from '../assets/profileSample.png';

function Profile({ name, applicantId, email, phone, prevJob, applyingFor }) {
    return (
        <div className="flex flex-col items-center text-center gap-4 w-full">
            <img
                        src={profileSample}
                        alt="Profile"
                        className="rounded-full w-16 h-16 border border-gray-500"
                      />
            <h2 className="text-2xl font-semibold text-gray-200">{name}</h2>
            <div className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium">
                Applicant ID: {applicantId}
            </div>
            <div className="text-gray-400 space-y-1 text-sm text-left w-full">
                <p>Email: <span className="text-gray-300">{email}</span></p>
                <p>Phone: <span className="text-gray-300">{phone}</span></p>
                <p>Previous Job: <span className="text-gray-300">{prevJob}</span></p>
                <p>Applying for: <span className="text-gray-300">{applyingFor}</span></p>
            </div>
        </div>
    );
}

function ApplicantActionCard() {
    const applicant = {
        name: "Matthew Roxas",
        applicantId: "123456",
        email: "matthew@example.com",
        phone: "+123456789",
        prevJob: "Web Developer",
        applyingFor: "Software Engineer"
    };

    return (
        <div className="w-full max-w-md p-6 shadow-lg border border-gray-700 rounded-2xl bg-gray-800 text-gray-300 flex flex-col">
            {/* Profile Section */}
            <Profile {...applicant} />

            {/* Action Buttons (Left-Aligned & No Overflow) */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="btn flex items-center gap-2 border-2 border-warning text-warning hover:bg-warning/10 transition px-3 py-2 rounded-lg text-left">
                    <Phone size={18} /> Call
                </button>
                <button className="btn flex items-center gap-2 border-2 border-warning text-warning hover:bg-warning/10 transition px-3 py-2 rounded-lg text-left">
                    <Mail size={18} /> Message
                </button>
                <button className="btn flex items-center gap-2 border-2 border-warning text-warning hover:bg-warning/10 transition px-3 py-2 rounded-lg text-left">
                    <Calendar size={18} /> Appointment
                </button>
                <button className="btn flex items-center gap-2 border-2 border-warning text-warning hover:bg-warning/10 transition px-3 py-2 rounded-lg text-left">
                    <Star size={18} /> Review
                </button>
            </div>

            {/* Document Options (Left-Aligned) */}
            <div className="flex flex-col gap-2 mt-6">
                <button className="text-primary hover:text-primary/80 transition flex items-center text-sm text-left">
                    <FileText size={18} className="mr-1" /> View Resume
                </button>
                <button className="text-primary hover:text-primary/80 transition flex items-center text-sm text-left">
                    <FolderOpen size={18} className="mr-1" /> View Other Documents
                </button>
            </div>
        </div>
    );
}

export default ApplicantActionCard;
 