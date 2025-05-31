import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, LinearProgress } from '@mui/material';
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { enhanceManualReport } from '../../utils/geminiHelper';
import { uploadPDFToCloudinary, generateCloudinaryViewUrl, generateDownloadUrl } from '../../utils/cloudinaryHelper';

export default function DepartmentData() {
  const [user, loading, authError] = useAuthState(auth);
  const [userDepartment, setUserDepartment] = useState(null);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Waste Collection Optimization', status: 'In Progress' },
    { id: 2, name: 'Public Toilet Maintenance', status: 'Planning' },
    { id: 3, name: 'Recycling Program', status: 'Completed' }
  ]);
  
  const [resources, setResources] = useState([
    { id: 1, name: 'Garbage Trucks', quantity: 5 },
    { id: 2, name: 'Sanitation Workers', quantity: 12 },
    { id: 3, name: 'Cleaning Equipment', quantity: 20 }
  ]);
  
  const [reportText, setReportText] = useState('');
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [processingReport, setProcessingReport] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Firestore collection references
  const reportsCollection = collection(db, 'reports');
  const usersCollection = collection(db, 'users');
  const officersCollection = collection(db, 'officers');

  // Fetch user's department when user is authenticated
  useEffect(() => {
    if (user && !userDepartment && !loadingDepartment) {
      fetchUserDepartment();
    }
  }, [user]);

  // Load department reports when department is determined
  useEffect(() => {
    if (userDepartment) {
      loadDepartmentReports();
    }
  }, [userDepartment]);

  const fetchUserDepartment = async () => {
    if (!user) return;
    
    setLoadingDepartment(true);
    setErrorMessage('');
    
    try {
      console.log('Fetching department for user:', user.uid, user.email);
      
      // Strategy 1: Direct lookup by user ID in users collection
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Found user in users collection:', userData);
        if (userData.department) {
          setUserDepartment(userData.department);
          return;
        }
      }
      
      // Strategy 2: Direct lookup by user ID in officers collection
      const officerDocRef = doc(db, 'officers', user.uid);
      const officerDoc = await getDoc(officerDocRef);
      
      if (officerDoc.exists()) {
        const officerData = officerDoc.data();
        console.log('Found user in officers collection:', officerData);
        if (officerData.department) {
          setUserDepartment(officerData.department);
          return;
        }
      }
      
      // Strategy 3: Search by email in users collection
      const userQuery = query(usersCollection, where('email', '==', user.email));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log('Found user by email in users collection:', userData);
        if (userData.department) {
          setUserDepartment(userData.department);
          return;
        }
      }
      
      // Strategy 4: Search by email in officers collection
      const officerQuery = query(officersCollection, where('email', '==', user.email));
      const officerSnapshot = await getDocs(officerQuery);
      
      if (!officerSnapshot.empty) {
        const officerData = officerSnapshot.docs[0].data();
        console.log('Found user by email in officers collection:', officerData);
        if (officerData.department) {
          setUserDepartment(officerData.department);
          return;
        }
      }
      
      // If no department found anywhere
      console.log('No department found for user');
      setErrorMessage('Department information not found. Please contact administrator to assign your department.');
      
    } catch (error) {
      console.error('Error fetching user department:', error);
      setErrorMessage(`Failed to fetch department information: ${error.message}`);
    } finally {
      setLoadingDepartment(false);
    }
  };

  const loadDepartmentReports = async () => {
    if (!userDepartment) return;
    
    setLoadingReports(true);
    setErrorMessage('');
    
    try {
      console.log('Loading reports for department:', userDepartment);
      
      const q = query(
        reportsCollection,
        where('department', '==', userDepartment)
      );
      
      const querySnapshot = await getDocs(q);
      const loadedReports = [];
      
      querySnapshot.forEach((doc) => {
        const reportData = doc.data();
        loadedReports.push({ 
          id: doc.id, 
          ...reportData 
        });
      });
      
      // Sort in memory by createdAt (descending - newest first)
      loadedReports.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      console.log(`Loaded ${loadedReports.length} reports for ${userDepartment} department`);
      setReports(loadedReports);
      
    } catch (error) {
      console.error('Error loading department reports:', error);
      
      if (error.message.includes('index')) {
        setErrorMessage(
          'Database index required for optimal performance. ' +
          'Reports loaded without sorting. Please create the required index in Firebase Console.'
        );
      } else {
        setErrorMessage(`Failed to load reports: ${error.message}`);
      }
    } finally {
      setLoadingReports(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userDepartment) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file only.');
      e.target.value = '';
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage('File size must be less than 10MB.');
      e.target.value = '';
      return;
    }
    
    setProcessingReport(true);
    setUploadProgress(0);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      console.log('Uploading PDF for department:', userDepartment);
      
      // Upload to Cloudinary
      setUploadProgress(30);
      console.log('Uploading PDF to Cloudinary...');
      
      const cloudinaryResult = await uploadPDFToCloudinary(file, userDepartment);
      setUploadProgress(70);
      
      console.log('PDF uploaded to Cloudinary:', cloudinaryResult);
      
      // Save to Firestore with proper URLs
      setUploadProgress(90);
      console.log('Saving report to Firestore...');
      
      const reportDoc = {
        title: `PDF Report: ${file.name}`,
        content: `PDF file uploaded: ${file.name}`,
        department: userDepartment,
        type: 'pdf',
        
        // Original file metadata
        fileName: file.name,
        fileSize: file.size,
        
        // Cloudinary metadata
        cloudinaryUrl: cloudinaryResult.url, // Download URL
        cloudinaryViewUrl: cloudinaryResult.viewUrl, // View URL
        cloudinaryPublicId: cloudinaryResult.publicId || '',
        cloudinaryFolder: cloudinaryResult.folder || `reports/sanitation/${userDepartment.toLowerCase().replace(/\s+/g, '_')}`,
        
        // Additional Cloudinary info
        cloudinaryResourceType: cloudinaryResult.resourceType || 'raw',
        cloudinaryFormat: cloudinaryResult.format || 'pdf',
        cloudinaryBytes: cloudinaryResult.bytes || file.size,
        cloudinaryVersion: cloudinaryResult.version,
        
        // User and timestamp info
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: new Date(),
        uploadedAt: cloudinaryResult.createdAt || new Date().toISOString()
      };

      console.log('Saving report to Firestore:', reportDoc);
      await addDoc(reportsCollection, reportDoc);
      
      setUploadProgress(100);
      
      // Reload reports to show the new one
      await loadDepartmentReports();
      
      setSuccessMessage('PDF uploaded successfully and stored in cloud!');
      
      // Clear the file input
      e.target.value = '';
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setErrorMessage(`Failed to upload PDF: ${error.message}`);
    } finally {
      setProcessingReport(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadPDF = (report) => {
    if (!report.cloudinaryPublicId) {
      console.error('No public ID found for download');
      return;
    }
    
    // Use the proper download URL with attachment header
    const downloadUrl = generateDownloadUrl(
      report.cloudinaryPublicId, 
      report.fileName || 'report.pdf',
      report.cloudinaryResourceType || 'raw'
    );
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = report.fileName || 'report.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPDF = (report) => {
    if (!report.cloudinaryPublicId) {
      console.error('No public ID found for viewing');
      return;
    }
    
    // Use the proper view URL
    const viewUrl = report.cloudinaryViewUrl || generateCloudinaryViewUrl(
      report.cloudinaryPublicId, 
      report.cloudinaryResourceType || 'raw'
    );
    
    console.log('Opening PDF URL:', viewUrl);
    window.open(viewUrl, '_blank');
  };

  const handleManualReport = async () => {
    if (!reportText.trim() || !userDepartment) return;
    
    setProcessingReport(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      console.log('Processing manual report for department:', userDepartment);
      
      // Enhance manual report using Gemini AI
      const enhanced = await enhanceManualReport(reportText, userDepartment);
      
      // Create enhanced report document
      const reportDoc = {
        title: `Manual Report - ${new Date().toLocaleDateString()}`,
        content: enhanced.enhanced,
        originalText: enhanced.original,
        department: userDepartment,
        type: 'manual',
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: new Date(),
        enhancedAt: enhanced.enhancedAt
      };

      console.log('Saving manual report to Firestore:', reportDoc);
      await addDoc(reportsCollection, reportDoc);
      
      // Reload reports to show the new one
      await loadDepartmentReports();
      
      setReportText('');
      setSuccessMessage('Manual report enhanced and saved successfully!');
      
    } catch (error) {
      console.error('Error processing manual report:', error);
      setErrorMessage(`Failed to process manual report: ${error.message}`);
    } finally {
      setProcessingReport(false);
    }
  };

  // Format report content by removing markdown and making certain words bold
  const formatReportContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    
    return (
      <Box sx={{ whiteSpace: 'pre-wrap' }}>
        {lines.map((line, index) => {
          if (!line.trim()) {
            return <br key={index} />;
          }

          let cleanLine = line
            .replace(/^#{1,6}\s*/, '')
            .replace(/\*\*/g, '')
            .replace(/^•\s*/, '')
            .trim();

          const shouldBeBold = 
            cleanLine.includes('ENHANCED REPORT SUMMARY') ||
            cleanLine.includes('KEY INSIGHTS') ||
            cleanLine.includes('EXTRACTED METRICS') ||
            cleanLine.includes('IDENTIFIED RISKS') ||
            cleanLine.includes('STRATEGIC RECOMMENDATIONS') ||
            cleanLine.includes('PROPOSED KPIs') ||
            cleanLine.includes('IMPLEMENTATION ROADMAP') ||
            cleanLine.includes('FOLLOW-UP REQUIREMENTS') ||
            cleanLine.startsWith('Insight') ||
            cleanLine.includes('Priority:') ||
            cleanLine.includes('KPI') ||
            cleanLine.includes('Week') ||
            cleanLine.includes('Month');

          if (shouldBeBold || cleanLine.match(/^(Insight|Priority|KPI|Week|Month)/)) {
            return (
              <Typography 
                key={index} 
                variant="body1" 
                sx={{ fontWeight: 'bold', mb: 0.5 }}
              >
                {cleanLine}
              </Typography>
            );
          } else if (cleanLine.includes(':')) {
            const [label, ...rest] = cleanLine.split(':');
            return (
              <Typography key={index} variant="body1" sx={{ mb: 0.5 }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {label}:
                </Box>
                {rest.join(':')}
              </Typography>
            );
          } else {
            return (
              <Typography key={index} variant="body1" sx={{ mb: 0.5 }}>
                {cleanLine}
              </Typography>
            );
          }
        })}
      </Box>
    );
  };

  // Show error if user is not authenticated
  if (!user) {
    return (
      <Box>
        <Alert severity="error">
          Please log in to access department data.
        </Alert>
      </Box>
    );
  }

  // Show loading while fetching department
  if (loadingDepartment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading department information...
        </Typography>
      </Box>
    );
  }

  // Show error if department not found
  if (!loadingDepartment && !userDepartment) {
    return (
      <Box>
        <Alert severity="error">
          {errorMessage || "Department information not found. Please contact administrator."}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={fetchUserDepartment} 
          sx={{ mt: 2 }}
        >
          Retry Loading Department
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {userDepartment} Department Dashboard
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Logged in as: {user.email}
      </Typography>
      
      <Typography variant="h5" gutterBottom>Department Projects</Typography>
      <List>
        {projects.map(project => (
          <ListItem key={project.id}>
            <ListItemText primary={project.name} secondary={`Status: ${project.status}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Department Resources</Typography>
      <List>
        {resources.map(resource => (
          <ListItem key={resource.id}>
            <ListItemText primary={resource.name} secondary={`Quantity: ${resource.quantity}`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Create New Report</Typography>
      
      {/* Error and Success Messages */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {/* Upload Progress Bar */}
      {processingReport && uploadProgress > 0 && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            {uploadProgress < 30 && 'Preparing upload...'}
            {uploadProgress >= 30 && uploadProgress < 70 && 'Uploading to cloud storage...'}
            {uploadProgress >= 70 && uploadProgress < 90 && 'Upload complete, saving...'}
            {uploadProgress >= 90 && uploadProgress < 100 && 'Finalizing...'}
            {uploadProgress === 100 && 'Complete!'}
          </Typography>
        </Box>
      )}
      
      {/* PDF Upload */}
      <Box sx={{ mb: 2 }}>
        <input
          accept="application/pdf"
          style={{ display: 'none' }}
          id="pdf-upload"
          type="file"
          onChange={handlePDFUpload}
          disabled={processingReport}
        />
        <label htmlFor="pdf-upload">
          <Button 
            variant="contained" 
            component="span"
            disabled={processingReport}
            sx={{ mr: 2 }}
          >
            {processingReport ? <CircularProgress size={24} /> : 'Upload PDF Report'}
          </Button>
        </label>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Upload a PDF file (max 10MB) to store in cloud storage
        </Typography>
      </Box>
      
      {/* Manual Report Input */}
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Manual Report"
        placeholder="Write your report manually... (AI will enhance it with insights and analysis)"
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        disabled={processingReport}
        sx={{ mt: 2 }}
      />
      
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={handleManualReport}
        disabled={!reportText.trim() || processingReport}
      >
        {processingReport ? <CircularProgress size={24} /> : 'Submit & Enhance Report'}
      </Button>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {userDepartment} Department Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Manual reports are enhanced with AI-powered insights. PDF files are stored securely in cloud storage and can be viewed/downloaded.
      </Typography>
      
      {loadingReports ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading reports...
          </Typography>
        </Box>
      ) : reports.length === 0 ? (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No reports found for {userDepartment} department.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={loadDepartmentReports}
            size="small"
          >
            Refresh Reports
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {reports.length} report(s) for {userDepartment} department
          </Typography>
          <List>
            {reports.map(report => (
              <Paper key={report.id} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">{report.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        bgcolor: report.type === 'pdf' ? 'primary.light' : 'secondary.light',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      {report.type.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {report.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                    </Typography>
                    {report.cloudinaryUrl && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewPDF(report)}
                          sx={{ ml: 1 }}
                        >
                          View PDF
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleDownloadPDF(report)}
                        >
                          Download
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Department: {report.department}
                </Typography>
                
                {report.fileName && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Source: {report.fileName} ({Math.round(report.fileSize / 1024)} KB)
                    {report.cloudinaryUrl && (
                      <Typography component="span" sx={{ ml: 2, color: 'success.main' }}>
                        ☁️ Stored in cloud
                      </Typography>
                    )}
                  </Typography>
                )}
                
                {report.cloudinaryPublicId && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Cloud ID: {report.cloudinaryPublicId}
                  </Typography>
                )}
                
                {report.createdByEmail && (
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Created by: {report.createdByEmail}
                  </Typography>
                )}
                
                <Box sx={{ mt: 2 }}>
                  {report.type === 'pdf' ? (
                    <Typography variant="body1">
                      PDF file uploaded and stored in cloud. Use the View/Download buttons to access the file.
                    </Typography>
                  ) : (
                    formatReportContent(report.content)
                  )}
                </Box>
                
                {report.originalText && report.originalText !== report.content && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Original Text:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {report.originalText.length > 300 
                        ? `${report.originalText.substring(0, 300)}...` 
                        : report.originalText
                      }
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}