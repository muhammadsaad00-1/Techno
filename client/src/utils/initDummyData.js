import { db, officersCollection, issuesCollection, projectsCollection } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const initDummyData = async () => {
  // Dummy officers
  await addDoc(officersCollection, {
    email: 'sanitation1@oi.com',
    department: 'Sanitation',
    name: 'John Doe'
  });

  await addDoc(officersCollection, {
    email: 'transport1@oi.com',
    department: 'Transport',
    name: 'Jane Smith'
  });

  // Dummy issues
  await addDoc(issuesCollection, {
    title: 'Overflowing garbage bin',
    description: 'Bin at Main Street is overflowing for 2 days',
    status: 'Pending',
    department: 'Sanitation',
    location: 'Main Street',
    reporter: 'citizen1@ui.com',
    createdAt: new Date()
  });

  // Dummy projects
  await addDoc(projectsCollection, {
    name: 'Waste Collection Optimization',
    status: 'In Progress',
    department: 'Sanitation',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31')
  });

  console.log('Dummy data initialized');
};