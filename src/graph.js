export default [
  {
    id: 1,
    title: 'Headcount growth',
    dependencies: [
      {
        id: 10
      },
      {
        id: 8
      }
    ]
  },
  {
    id: 6,
    title: 'More great colleagues!',
    dependencies: [
      {
        id: 1
      }
    ]
  },
  {
    id: 7,
    title: 'Individual talent growth',
    dependencies: [
      {
        id: 1,
        description: 'Existing employees can learn new things from new recruits'
      }
    ]
  },
  {
    id: 10,
    title: 'New career opportunities',
    dependencies: [
      {
        id: 1,
        description: 'Larger headcount increases demand and complexity of management and thus provides new specialisation opportunities'
      }
    ]
  },
  {
    id: 2,
    title: 'Talent base growth',
    dependencies: [
      {
        id: 1,
        description: 'New hires bring in new expertise'
      }
    ]
  },
  {
    id: 9,
    title: 'Ability to take part in tenders',
    dependencies: [
      {
        id: 2,
        description: 'Tenders require a certain amount of people with certain expertise (CV)',
      }
    ]
  },
  {
    id: 8,
    title: 'More interesting projects',
    dependencies: [
      {
        id: 2,
        description: 'Diverse talent ables more broad scope, which makes projects more interesting.'
      },
      {
        id: 9
      }
    ]
  },
  {
    id: 3,
    title: 'Diversification of offering',
    dependencies: [
      {
        id: 2
      }
    ]
  },
  {
    id: 4,
    title: 'Diversification of business',
    dependencies: [
      {
        id: 3
      }
    ]
  },
  {
    id: 5,
    title: 'Business stability',
    dependencies: [
      {
        id: 4,
        title: 'A more diverse business is less dependent on individual industries and clients'
      }
    ]
  }
]