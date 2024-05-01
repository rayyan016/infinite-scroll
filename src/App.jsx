import "./App.css";
import JobsList from "./components/JobsList";

function App() {
  return (
    <>
      <div className="container mx-auto py-8 ">
        <h1 className="text-white text-3xl font-bold mb-4">Job Listings</h1>
        <JobsList />
      </div>
    </>
  );
}

export default App;
