// This mock data simulates requests sent by users to the admin.
export const mockRequests = [
    {
      id: 'req1',
      userId: 'user123',
      userName: 'John Doe',
      category: 'Event Submission',
      details: {
        title: 'Tech Meetup 2025',
        date: new Date('2025-11-05T18:00:00'),
        location: 'Community Hall, Tech Park',
        description: 'A meetup for tech enthusiasts to network and share ideas.',
        image: 'https://via.placeholder.com/300x150.png?text=Tech+Meetup'
      },
      status: 'Pending',
      submittedAt: new Date('2025-09-24T10:00:00'),
    },
    {
      id: 'req2',
      userId: 'user456',
      userName: 'Jane Smith',
      category: 'Open Work Request',
      details: {
        title: 'Need a Freelance Logo Designer',
        description: 'Looking for a skilled designer to create a modern logo for a new startup. Please provide portfolio links.',
        budget: '₹5,000 - ₹8,000',
        skills: 'Graphic Design, Adobe Illustrator, Branding',
      },
      status: 'Pending',
      submittedAt: new Date('2025-09-23T15:30:00'),
    },
    {
      id: 'req3',
      userId: 'user789',
      userName: 'Peter Jones',
      category: 'Bug Report',
      details: {
        description: 'The "Find a Mentor" search bar is not working on mobile browsers. It doesn\'t allow me to type anything.',
      },
      status: 'Pending',
      submittedAt: new Date('2025-09-22T09:15:00'),
    }
];