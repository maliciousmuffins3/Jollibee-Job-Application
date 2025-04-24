function Dashboard(){
  return(
    <>
      <h2 className="text-2xl font-bold mb-4">Welcome, {/* user?.fullName || */"Matthew Roxas"}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Total Applications", "Scheduled Meetings", "Pending Approvals"].map((title, i) => (
          <div key={i} className={`card p-4 shadow-md ${i === 0 ? "bg-primary text-primary-content" : i === 1 ? "bg-secondary text-secondary-content" : "bg-accent text-accent-content"}`}>
            <h2 className="text-lg font-bold text-center">{title}</h2>
            <p className="text-3xl font-semibold text-center">{i === 0 ? "1,245" : i === 1 ? "63" : "103"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;