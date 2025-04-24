import ApplicantActionCard from "../components/ApplicantActionCard";
import SearchBarHeader from "../components/SearchBarHeader";

function ApplicantList() {
  return (
    <>
      <SearchBarHeader/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
        <ApplicantActionCard />
        <ApplicantActionCard />
        <ApplicantActionCard />
        <ApplicantActionCard />
      </div>
    </>
  );
}

export default ApplicantList;
