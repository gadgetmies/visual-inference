// Example: how protected bike lanes ripple through a city.
// polarity "+": more of the cause means more of the effect; "-": less.
// kind "argument": a reason to believe the other claim rather than a cause.
// Evidence is given only where a well-known source supports the link; the
// rest are left open on purpose to show how unsupported links appear.

const nodes = [
  "Protected bike lanes",
  "Perceived cycling safety",
  "People cycling",
  "Car trips",
  "Traffic congestion",
  "Air pollution",
  "Public health",
  "Street noise",
  "Local shop visits",
  "Local business revenue",
  "Political support for cycling",
  "Cycling investment",
  "Road injuries",
  "Bus travel times",
  "Physical activity",
  "Household transport costs",
  "Crowding on bike lanes",
  "The cycling scheme is working",
  "The council’s cycling plan is right",
];

const WHO_AIR =
  "WHO fact sheet: Ambient (outdoor) air quality and health https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health";
const WHO_NOISE = "WHO Environmental Noise Guidelines for the European Region (2018)";

// [cause, effect, polarity, reasoning, evidence, kind]
const links = [
  [
    "Protected bike lanes",
    "Perceived cycling safety",
    "+",
    "Lanes physically separated from traffic remove what new riders fear most: riding close to fast cars.",
    "Winters & Teschke (2010), Route preferences among adults in the near market for bicycling, American Journal of Health Promotion 25(1)",
  ],
  [
    "Protected bike lanes",
    "Crowding on bike lanes",
    "-",
    "More lane space spreads the same number of riders over more room.",
  ],
  [
    "Perceived cycling safety",
    "People cycling",
    "+",
    "Many people would like to cycle but don’t because traffic feels dangerous. When it feels safer, some of them start.",
    "Dill & McNeil (2013), Four types of cyclists?, Transportation Research Record 2387",
  ],
  [
    "People cycling",
    "Perceived cycling safety",
    "+",
    "Safety in numbers: where many people cycle, drivers expect and notice them, so each rider is safer.",
    "Jacobsen (2003), Safety in numbers, Injury Prevention 9(3) https://doi.org/10.1136/ip.9.3.205",
  ],
  [
    "People cycling",
    "Car trips",
    "-",
    "Some new bike trips replace trips that were made by car.",
  ],
  [
    "People cycling",
    "Physical activity",
    "+",
    "Riding to work, school or the shops builds exercise into daily routines.",
  ],
  [
    "People cycling",
    "Local shop visits",
    "+",
    "People on bikes can stop easily, so they tend to shop locally and more often.",
  ],
  [
    "People cycling",
    "Political support for cycling",
    "+",
    "More people who cycle means more voters who want cycling to be safe and convenient.",
  ],
  [
    "People cycling",
    "Household transport costs",
    "-",
    "Each car trip swapped for a bike trip saves fuel and parking; some households can give up a car.",
  ],
  [
    "People cycling",
    "Crowding on bike lanes",
    "+",
    "More riders on the same lanes make them busier.",
  ],
  [
    "Crowding on bike lanes",
    "Perceived cycling safety",
    "-",
    "Crowded lanes with riders at mixed speeds feel less safe, which puts newcomers off.",
  ],
  [
    "Car trips",
    "Traffic congestion",
    "+",
    "More cars on the same road space means longer queues.",
  ],
  [
    "Car trips",
    "Air pollution",
    "+",
    "Exhaust, brake and tyre wear from road traffic are a major source of urban air pollution.",
    WHO_AIR,
  ],
  [
    "Car trips",
    "Street noise",
    "+",
    "Road traffic is the most widespread source of noise in cities.",
    WHO_NOISE,
  ],
  [
    "Car trips",
    "Road injuries",
    "+",
    "More car traffic means more opportunities for collisions.",
  ],
  [
    "Traffic congestion",
    "Bus travel times",
    "+",
    "Buses without their own lanes get stuck in the same queues as cars.",
  ],
  [
    "Bus travel times",
    "Car trips",
    "+",
    "When buses are slow and unreliable, more people choose to drive instead.",
  ],
  [
    "Road injuries",
    "Perceived cycling safety",
    "-",
    "Crashes, and news of them, make cycling feel more dangerous.",
  ],
  [
    "Road injuries",
    "Public health",
    "-",
    "Injuries cause lasting harm as well as immediate suffering.",
  ],
  [
    "Air pollution",
    "Public health",
    "-",
    "Polluted air raises rates of stroke, heart disease, lung cancer and respiratory illness.",
    WHO_AIR,
  ],
  [
    "Street noise",
    "Public health",
    "-",
    "Long-term traffic noise disturbs sleep and is linked to heart disease.",
    WHO_NOISE,
  ],
  [
    "Physical activity",
    "Public health",
    "+",
    "Regular moderate exercise lowers the risk of heart disease, diabetes, some cancers and depression.",
    "WHO fact sheet: Physical activity https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ],
  [
    "Local shop visits",
    "Local business revenue",
    "+",
    "More visits mean more sales.",
  ],
  [
    "Local business revenue",
    "Political support for cycling",
    "+",
    "Shop owners who see more trade from people cycling are more likely to back further schemes.",
  ],
  [
    "Political support for cycling",
    "Cycling investment",
    "+",
    "Councils fund what voters and local businesses ask for.",
  ],
  [
    "Cycling investment",
    "Protected bike lanes",
    "+",
    "Investment pays for building and maintaining protected lanes.",
  ],
  [
    "People cycling",
    "The cycling scheme is working",
    "",
    "Rising cycling counts are evidence that the scheme works.",
    "",
    "argument",
  ],
  [
    "The cycling scheme is working",
    "The council’s cycling plan is right",
    "",
    "If the scheme works, the plan behind it must be right.",
    "",
    "argument",
  ],
  [
    "The council’s cycling plan is right",
    "The cycling scheme is working",
    "",
    "…and the scheme must be working because the plan is right. Circular: each claim only rests on the other.",
    "",
    "argument",
  ],
];

const id = (title) => {
  const index = nodes.indexOf(title);
  if (index === -1) throw new Error(`Unknown example node: ${title}`);
  return index;
};

const exampleGraph = {
  nodes: nodes.map((title, index) => ({ id: index, title })),
  connections: links.map(
    ([source, target, polarity, description, evidence = "", kind = "cause"]) => ({
      source: id(source),
      target: id(target),
      polarity,
      description,
      evidence,
      kind,
    })
  ),
};

export default exampleGraph;
