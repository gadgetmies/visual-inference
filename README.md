# Visual inference

Explore cause-and-effect graphs. Pick a node to see what leads to it (causes, on the left) and what it leads to (effects, on the right), two steps in each direction.

## Trying it out

Click **Explore the example graph** on the first screen, or open the app with `?example` in the URL (for example `https://gadgetmies.github.io/visual-inference/?example`). The example shows how protected bike lanes ripple through a city. Changes you make to it stay in your browser and never overwrite a graph you have saved there.

## Data sources

Choose the source on the first visit, or later from the settings button in the header.

- **Google Sheet**: paste the sheet URL or ID. Share the sheet as *Anyone with the link can view*; it is read directly from the browser, so no server is needed.
  - **Nodes tab** (optional): column A is the node title.
  - **Connections tab**: column A is the cause, B the effect, C the reasoning (optional). Nodes that only appear here are added automatically. Two more optional columns enable loop analysis (see below):
    - **D, direction**: `+` when more of the cause means more of the effect, `-` when it means less. Leave it blank if unknown.
    - **E, kind**: `argument` when A is a reason to believe B rather than a cause of it. Blank means `cause`.
    - **F, evidence**: sources that support the link, one per line or separated by ` ; `. URLs become links.
  - Tick *The first row of each tab is a header* if your tabs have a header row.
- **Sheet proxy**: for private sheets served through a [google-sheet-server](https://github.com/gadgetmies/google-sheet-server) compatible endpoint (`{ sheets: [{ values }, …] }`), with optional basic-auth credentials.
- **This browser**: build a graph from scratch without a sheet.

### Sharing a link to a sheet

Add `?sheet=<sheet id>` to the app URL (optionally `&nodes=<tab>&connections=<tab>&header=1`). The settings page has a *Copy link* button that builds this for you.

## Reading a node

Arrows run from cause to effect and connect each card to the one it affects. Each card states its claim (`▲ more → ▼ less`: more of the cause means less of the effect) and shows whether its link cites evidence. Below the graph, **How it connects** lists every direct link of the node with its full claim ("More People cycling means less Car trips"), the reasoning, and the evidence, and points out links that have none.

## Loops

The **Loops** tab lists every chain of effects that leads back to where it started (up to 8 steps), and each node page lists the loops through that node. **Show in graph** highlights a loop's links. Each loop says how many of its links cite no evidence: a loop is only as strong as its weakest link.

| Type | When | Meaning |
| --- | --- | --- |
| **Circular reasoning** | every link in the loop is an `argument` | each claim ends up supporting itself |
| **Reinforcing** | an even number of `-` links | the loop amplifies itself: a virtuous or vicious circle |
| **Balancing** | an odd number of `-` links | the loop pushes back towards a limit |
| **Unclassified** | some link has no `+` or `-` | add directions in column D to classify it |

While editing, the panel warns when a new link would close a loop or a circular argument.

## Editing the graph

Click **Edit graph**. You can then:

- add nodes from the overview,
- rename or delete a node, and add, remove or annotate its causes and effects from the panel on the node page, including each link's direction (+/−), kind (cause or argument), reasoning and evidence.

Edits are saved in your browser. For a Google Sheet source, **Copy nodes** and **Copy connections** copy tab-separated rows that you paste into cell A1 of the matching tab. Then use **Discard changes** to go back to reading the sheet. You can also export or import the whole graph as JSON.

## Publishing on GitHub Pages

The `Deploy to GitHub Pages` workflow (`.github/workflows/deploy.yml`) runs the tests, builds the app and publishes it on every push to `main`.

1. In the repository settings, open **Pages** and set **Source** to **GitHub Actions**.
2. Optionally, under **Settings → Secrets and variables → Actions → Variables**, set `SHEET_ID` (and `NODES_TAB`, `CONNECTIONS_TAB`, `SHEET_HAS_HEADER`) so that visitors open that sheet by default.
3. Push to `main`, or run the workflow by hand from the Actions tab.

The app uses hash-based routes (`#/node/3`) and relative asset paths, so it works under `https://<user>.github.io/<repo>/` without extra configuration.

## Development

```sh
yarn install
yarn start      # dev server on http://localhost:3000
yarn test       # unit tests
yarn build      # production build in build/
```

You can set `REACT_APP_SHEET_ID` (and the other `REACT_APP_*` variables used in the workflow) in a `.env.local` file to open a sheet by default.
