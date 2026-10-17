// Example: how protected bike lanes ripple through a city.
const exampleGraph = {
  nodes: [
    { id: 0, title: "Protected bike lanes" },
    { id: 1, title: "Perceived cycling safety" },
    { id: 2, title: "People cycling" },
    { id: 3, title: "Car trips" },
    { id: 4, title: "Traffic congestion" },
    { id: 5, title: "Air pollution" },
    { id: 6, title: "Public health" },
    { id: 7, title: "Healthcare costs" },
    { id: 8, title: "Street noise" },
    { id: 9, title: "Local shop visits" },
    { id: 10, title: "Local business revenue" },
    { id: 11, title: "Political support for cycling" },
    { id: 12, title: "Cycling investment" },
    { id: 13, title: "Road injuries" },
    { id: 14, title: "Bus travel times" },
    { id: 15, title: "Physical activity" },
    { id: 16, title: "Household transport costs" },
  ],
  connections: [
    {
      source: 0,
      target: 1,
      description:
        "Physical separation from cars makes riding feel safe for beginners, children and older people.",
    },
    {
      source: 0,
      target: 4,
      description:
        "Taking a lane from cars can add congestion at first, until traffic adapts.",
    },
    {
      source: 1,
      target: 2,
      description: "Fear of traffic is the most common reason people give for not cycling.",
    },
    {
      source: 2,
      target: 1,
      description:
        "Safety in numbers: drivers watch out for cyclists when there are more of them.",
    },
    {
      source: 2,
      target: 3,
      description: "Many short car trips are replaced by bike trips.",
    },
    {
      source: 2,
      target: 15,
      description: "Cycling builds everyday exercise into the commute.",
    },
    {
      source: 2,
      target: 9,
      description: "People on bikes stop more easily, so they shop locally more often.",
    },
    {
      source: 2,
      target: 11,
      description: "More people cycling means more voters who care about it.",
    },
    {
      source: 2,
      target: 16,
      description: "A bike costs far less to own and run than a car.",
    },
    {
      source: 3,
      target: 4,
      description: "More cars on the same roads means longer queues.",
    },
    {
      source: 3,
      target: 5,
      description: "Exhaust and tyre wear are major sources of urban NO₂ and particulates.",
    },
    {
      source: 3,
      target: 8,
      description: "Engines and tyres are the main source of street noise.",
    },
    {
      source: 3,
      target: 13,
      description: "More car traffic means more collisions.",
    },
    {
      source: 4,
      target: 14,
      description: "Buses get stuck in the same queues as cars.",
    },
    {
      source: 14,
      target: 3,
      description: "Slow, unreliable buses push people back into cars.",
    },
    {
      source: 13,
      target: 1,
      description: "News of crashes shapes how dangerous people think cycling is.",
    },
    {
      source: 5,
      target: 6,
      description: "Air pollution raises rates of asthma, heart and lung disease.",
    },
    {
      source: 8,
      target: 6,
      description: "Constant noise disturbs sleep and raises stress.",
    },
    {
      source: 15,
      target: 6,
      description: "Regular moderate exercise lowers the risk of many chronic diseases.",
    },
    {
      source: 13,
      target: 6,
      description: "Injuries cause lasting harm as well as immediate suffering.",
    },
    {
      source: 6,
      target: 7,
      description: "Healthier residents need less treatment.",
    },
    {
      source: 7,
      target: 12,
      description: "Health savings strengthen the business case for cycling investment.",
    },
    {
      source: 9,
      target: 10,
      description: "More visits mean more sales.",
    },
    {
      source: 10,
      target: 11,
      description: "Shop owners who see the benefit back further schemes.",
    },
    {
      source: 11,
      target: 12,
      description: "Politicians fund what voters and local businesses support.",
    },
    {
      source: 12,
      target: 0,
      description: "Investment pays for building and maintaining protected lanes.",
    },
  ],
};

export default exampleGraph;
