# Visual inference

Explore cause-and-effect graphs. Pick a node to see what leads to it (causes, on the left) and what it leads to (effects, on the right), two steps in each direction.

## Trying it out

Click **Explore the example graph** on the first screen, or open the app with `?example` in the URL (for example `https://gadgetmies.github.io/visual-inference/?example`). The example shows how protected bike lanes ripple through a city. Changes you make to it stay in your browser and never overwrite a graph you have saved there.

## Data sources

Choose the source on the first visit, or later from the settings button in the header.

- **Google Sheet**: paste the sheet URL or ID. Share the sheet as *Anyone with the link can view*; it is read directly from the browser, so no server is needed.
  - **Nodes tab** (optional): column A is the node title.
  - **Connections tab**: column A is the cause, B the effect, C the reasoning (optional). Nodes that only appear here are added automatically.
  - Tick *The first row of each tab is a header* if your tabs have a header row.
- **Sheet proxy**: for private sheets served through a [google-sheet-server](https://github.com/gadgetmies/google-sheet-server) compatible endpoint (`{ sheets: [{ values }, …] }`), with optional basic-auth credentials.
- **This browser**: build a graph from scratch without a sheet.

### Sharing a link to a sheet

Add `?sheet=<sheet id>` to the app URL (optionally `&nodes=<tab>&connections=<tab>&header=1`). The settings page has a *Copy link* button that builds this for you.

## Editing the graph

Click **Edit graph**. You can then:

- add nodes from the overview,
- rename or delete a node, and add, remove or annotate its causes and effects from the panel on the node page.

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
