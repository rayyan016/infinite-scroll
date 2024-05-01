import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

const RolesArray = [
  "Frontend",
  "Backend",
  "Tech Lead",
  "Ios",
  "Android",
  "Fullstack",
  "Data Engineer",
  "Data Science",
];

const JobsList = () => {
  const [jobDetails, setJobDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJobRoles, setSelectedJobRoles] = useState([]); // State to hold selected job roles
  const pageRef = useRef(17);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const limit = 10; // Number of results per page
      const offset = pageRef.current * limit; // Calculate offset for pagination

      const raw = JSON.stringify({
        limit: limit,
        offset: offset,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      const data = await response.json();

      // Check if there are more results
      if (data.jdList.length === 0) {
        setHasMore(false);
      } else {
        setJobDetails((prevJobDetails) => [...prevJobDetails, ...data.jdList]);
        pageRef.current++;
      }
    } catch (error) {
      console.error("Error fetching job details: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.offsetHeight -
        parseInt(window.innerHeight + document.documentElement.scrollTop) >
        10 ||
      isLoading
    ) {
      return;
    } else {
      fetchJobDetails();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRoleFilterChange = (event, newValue) => {
    setSelectedJobRoles(newValue);
  };

  const filteredJobDetails =
    selectedJobRoles.length > 0
      ? jobDetails.filter((job) => {
          return selectedJobRoles.some(
            (role) => role.toLowerCase() === job.jobRole.toLowerCase()
          );
        })
      : jobDetails;

  return (
    <>
      <div
        className="mb-6"
        style={{
          width: `${
            selectedJobRoles.length * 100 < 250
              ? 400
              : selectedJobRoles.length * 170
          }px`,
        }}
      >
        <Autocomplete
          multiple
          value={selectedJobRoles}
          onChange={handleRoleFilterChange}
          options={RolesArray}
          renderInput={(params) => (
            <TextField {...params} label="Select Job Roles" />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
        {/* Render filtered job details */}
        {filteredJobDetails.map((job, index) => (
          <Card key={index} className="w-11/12">
            <CardContent className="bg-emerald-100">
              <Typography variant="h5" component="div">
                {job.jobRole}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {job.location}
              </Typography>
              <Typography variant="body2" component="p">
                {job.jobDetailsFromCompany}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Salary:{" "}
                {job.minJdSalary != null
                  ? parseFloat(job.minJdSalary).toFixed(2)
                  : "N/A"}{" "}
                -{" "}
                {job.maxJdSalary != null
                  ? parseFloat(job.maxJdSalary).toFixed(2)
                  : "N/A"}{" "}
                {job.salaryCurrencyCode}
              </Typography>
              <Typography color="textSecondary">
                Experience: {job.minExp} - {job.maxExp} years
              </Typography>
              <Button
                className="w-full"
                variant="contained"
                color="success"
                href={job.jdLink}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ElectricBoltIcon />}
              >
                Easy Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {isLoading && (
        <div className="mt-8 flex justify-center">
          <CircularProgress />
        </div>
      )}
      {!isLoading && !hasMore && <div>No more jobs</div>}
    </>
  );
};

export default JobsList;
