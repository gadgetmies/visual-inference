export default {
  nodes: [
    {
      id: 1,
      title: "Headcount growth",
    },
    {
      id: 6,
      title: "More great colleagues!",
    },
    {
      id: 7,
      title: "Individual talent growth",
    },
    {
      id: 10,
      title: "New career opportunities",
    },
    {
      id: 2,
      title: "Talent base growth",
    },
    {
      id: 9,
      title: "Ability to take part in tenders",
    },
    {
      id: 8,
      title: "More interesting projects",
    },
    {
      id: 3,
      title: "Diversification of offering",
    },
    {
      id: 4,
      title: "Diversification of business",
    },
    {
      id: 5,
      title: "Business stability",
    },
  ],
  connections: [
    {
      source: 10,
      target: 1,
    },
    {
      source: 8,
      target: 1,
    },
    {
      source: 1,
      target: 6,
    },
    {
      source: 1,
      target: 7,
      description: "Existing employees can learn new things from new recruits",
    },
    {
      source: 1,
      target: 10,
      description:
        "Larger headcount increases demand and complexity of management and thus provides new specialisation opportunities",
    },
    {
      source: 1,
      target: 2,
      description: "New hires bring in new expertise",
    },
    {
      source: 2,
      target: 9,
      description:
        "Tenders require a certain amount of people with certain expertise (CV)",
    },
    {
      source: 2,
      target: 8,
      description:
        "Diverse talent ables more broad scope, which makes projects more interesting.",
    },
    {
      source: 9,
      target: 8,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 3,
      target: 4,
    },
    {
      source: 4,
      target: 5,
      description:
        "A more diverse business is less dependent on individual industries and clients",
    }
  ],
};
