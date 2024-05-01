import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";

const JobsList = () => {
  const [jobDetails, setJobDetails] = useState([]);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
      };
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      const data = await response.json();
      setJobDetails(data.jdList);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
      {jobDetails.map((job) => (
        <Card key={job.jdUid} className="w-11/12">
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
              Salary: {job.minJdSalary} - {job.maxJdSalary}{" "}
              {job.salaryCurrencyCode}
            </Typography>
            <Typography color="textSecondary">
              Experience: {job.minExp} - {job.maxExp} years
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobsList;
