import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AcUnitIcon from "@mui/icons-material/AcUnit";

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

const LocationsArray = ["Remote", "Hybrid", "In-office"];

const JobsList = () => {
  const [jobDetails, setJobDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJobRoles, setSelectedJobRoles] = useState([]); // State to hold selected job roles
  const [selectedExperience, setSelectedExperience] = useState(""); // State to hold selected experience
  const [selectedLocations, setSelectedLocations] = useState([]);
  const pageRef = useRef(30);

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

  const handleExperienceFilterChange = (event) => {
    setSelectedExperience(event.target.value);
  };

  const handleLocationFilterChange = (event, newValue) => {
    setSelectedLocations(newValue);
    console.log(newValue);
  };

  const filteredJobDetailsByRoles =
    selectedJobRoles.length > 0
      ? jobDetails.filter((job) =>
          selectedJobRoles.some(
            (role) => role.toLowerCase() === job.jobRole.toLowerCase()
          )
        )
      : jobDetails;

  const filteredJobDetailsByExperience =
    selectedExperience !== ""
      ? filteredJobDetailsByRoles.filter(
          (job) => job.minExp !== null && job.minExp >= selectedExperience
        )
      : filteredJobDetailsByRoles;

  let filteredJobDetails =
    selectedLocations.length > 0
      ? filteredJobDetailsByExperience.filter((job) =>
          selectedLocations.some(
            (location) => location.toLowerCase() === job.location.toLowerCase()
          )
        )
      : filteredJobDetailsByExperience;

  // If "in-office" is selected, append entries where location is neither "remote" nor "hybrid"
  if (selectedLocations.includes("In-office")) {
    filteredJobDetails = [
      ...filteredJobDetails,
      ...filteredJobDetailsByExperience.filter(
        (job) => !["remote", "hybrid"].includes(job.location.toLowerCase())
      ),
    ];
  }

  return (
    <>
      <div
        className="mb-6 inline-block"
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
          renderInput={(params) => <TextField {...params} label="Job Roles" />}
        />
      </div>

      <div className="ml-2 mb-6 inline-block w-48">
        <FormControl fullWidth>
          <InputLabel>Select Experience</InputLabel>
          <Select
            labelId="experience-filter-label"
            label="Select Experience"
            id="experience-filter"
            value={selectedExperience}
            onChange={handleExperienceFilterChange}
          >
            <MenuItem value="">None</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((exp) => (
              <MenuItem key={exp} value={exp}>
                {exp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div
        className="ml-2 mb-6 inline-block"
        style={{
          width: `${
            selectedLocations.length * 100 < 150
              ? 250
              : selectedLocations.length * 160
          }px`,
        }}
      >
        <Autocomplete
          multiple
          value={selectedLocations}
          onChange={handleLocationFilterChange}
          options={LocationsArray}
          renderInput={(params) => (
            <TextField {...params} label="Job Locations" />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
        {/* Render filtered job details */}
        {filteredJobDetails.map((job, index) => (
          <Card key={index} className="w-11/12">
            <CardContent className="">
              <div className="flex gap-x-2">
                <AcUnitIcon className="mt-[1px]" />
                <Typography variant="h5" component="div">
                  {job.jobRole}
                </Typography>
              </div>
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
                Experience: {job.minExp != null ? job.minExp : "N/A"} -{" "}
                {job.maxExp != null ? job.maxExp : "N/A"} years
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
