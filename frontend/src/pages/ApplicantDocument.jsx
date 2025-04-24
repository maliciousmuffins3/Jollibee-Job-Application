import ApplicantDocumentCard from "../components/ApplicantDocumentCard";
import SearchBarHeader from "../components/SearchBarHeader";

import { Megaphone } from "lucide-react";

function NotifyApplicants({ onClick }) {
    return (
        <button 
            onClick={onClick} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg shadow-lg hover:bg-gray-700 active:scale-95 transition"
        >
            <Megaphone size={24} className="text-yellow-400 shrink-0 pr-1" /> 
            <span className="text-lg font-medium">Notify all applicants with missing documents</span>
        </button>
    );
}


function ApplicantDocument() {
    return (
        <>  
            <SearchBarHeader>
                <NotifyApplicants />
            </SearchBarHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
                <ApplicantDocumentCard />
                <ApplicantDocumentCard />
                <ApplicantDocumentCard />
                <ApplicantDocumentCard />
            </div>
        </>
    );
}

export default ApplicantDocument;
