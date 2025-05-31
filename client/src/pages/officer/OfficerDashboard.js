import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, officersCollection } from '../../firebase';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import DepartmentData from './DepartmentData';
import IssueManagement from './IssueManagement';
import Communication from './Communication';
import ARFieldAssistance from './ARFieldAssistance';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function OfficerDashboard() {
  const { currentUser } = useAuth();
  const [department, setDepartment] = useState('Sanitation');
  const [value, setValue] = useState(0);
  const [officerData, setOfficerData] = useState(null);

  useEffect(() => {
    const fetchOfficerData = async () => {
      if (currentUser) {
        const officerRef = doc(officersCollection, currentUser.uid);
        const docSnap = await getDoc(officerRef);
        
        if (!docSnap.exists()) {
          // Create officer document if it doesn't exist
          await setDoc(officerRef, {
            email: currentUser.email,
            department: 'Sanitation', // Default department
            createdAt: new Date()
          });
          setOfficerData({ department: 'Sanitation' });
        } else {
          setOfficerData(docSnap.data());
          setDepartment(docSnap.data().department);
        }
      }
    };

    fetchOfficerData();
  }, [currentUser]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!officerData) return <div>Loading...</div>;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {department} Department Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Department Data" />
          <Tab label="Issue Management" />
          <Tab label="Communication" />
          <Tab label="AR Field Assistance" />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <DepartmentData department={department} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IssueManagement department={department} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Communication department={department} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ARFieldAssistance department={department} />
      </TabPanel>
    </Box>
  );
}