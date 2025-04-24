import SearchBarHeader from "../components/SearchBarHeader";
import ApplicantStatusCard from "../components/ApplicantStatusCard";

function ApplicantStatus() {
  return (
    <>
      <SearchBarHeader/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
        <ApplicantStatusCard />
        <ApplicantStatusCard />
        <ApplicantStatusCard />
        <ApplicantStatusCard />
      </div>
    </>
  );
}

export default ApplicantStatus;
