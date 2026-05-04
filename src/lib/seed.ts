import { collection, addDoc, serverTimestamp, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedDemoData() {
  const projectsSnap = await getDocs(collection(db, 'projects'));
  if (!projectsSnap.empty) return; // Already seeded

  console.log('Seeding demo data...');

  const demoProjects = [
    {
      name: 'SAHA Mobile Redesign',
      description: 'Overhaul the entire mobile experience with a focus on gesture-based navigation and high-performance animations.',
      status: 'Active',
      priority: 'High',
      managerId: 'manager-123',
      progress: 65,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-15'),
      createdAt: serverTimestamp(),
    },
    {
      name: 'Analytics Dashboard Engine',
      description: 'Building a robust engine for processing and visualizing complex team data in real-time.',
      status: 'Active',
      priority: 'Urgent',
      managerId: 'manager-123',
      progress: 40,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-30'),
      createdAt: serverTimestamp(),
    },
    {
      name: 'Security Audit Q2',
      description: 'Comprehensive security review of all API endpoints and cloud infrastructure permissions.',
      status: 'Completed',
      priority: 'Medium',
      managerId: 'admin-123',
      progress: 100,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-04-30'),
      createdAt: serverTimestamp(),
    }
  ];

  for (const proj of demoProjects) {
    const projRef = await addDoc(collection(db, 'projects'), proj);
    
    // Seed tasks for each project
    const tasks = [
      {
        title: 'Initial Research',
        status: 'Completed',
        priority: 'Medium',
        description: 'Competitor analysis and user interviews.',
        dueDate: new Date('2026-04-10'),
        createdAt: serverTimestamp(),
        tags: ['research', 'ux']
      },
      {
        title: 'Wireframing UI',
        status: 'In Progress',
        priority: 'High',
        description: 'Create low-fidelity wireframes for the main dashboard.',
        dueDate: new Date('2026-05-15'),
        createdAt: serverTimestamp(),
        tags: ['design']
      },
      {
        title: 'API Integration',
        status: 'Todo',
        priority: 'Urgent',
        description: 'Connect the frontend with the new analytics engine.',
        dueDate: new Date('2026-05-20'),
        createdAt: serverTimestamp(),
        tags: ['backend']
      }
    ];

    for (const task of tasks) {
      await addDoc(collection(db, 'projects', projRef.id, 'tasks'), task);
    }
  }

  // Create demo users
  const demoUsers = [
    { uid: 'admin-123', email: 'admin@saha.com', displayName: 'Admin User', role: 'Admin', teamIds: [], createdAt: serverTimestamp() },
    { uid: 'manager-123', email: 'manager@saha.com', displayName: 'Project Manager', role: 'Project Manager', teamIds: [], createdAt: serverTimestamp() },
    { uid: 'member-123', email: 'member@saha.com', displayName: 'Team Member', role: 'Team Member', teamIds: [], createdAt: serverTimestamp() },
  ];

  for (const user of demoUsers) {
    await setDoc(doc(db, 'users', user.uid), user);
  }

  console.log('Demo data seeded successfully!');
}
