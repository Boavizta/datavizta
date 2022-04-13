# Boavizta-front

## Data Explorer

This educational frontend intends to achieve several complementary objectives:
- Being able to search easily for carbon impact factors for digital equipment in [Boavizta environmental footprint open database](https://github.com/Boavizta/environmental-footprint-data)
- Being able to visualize the impacts repartition by stages of the life cycle of equipment by differentiating the use phase (scope 2) from the manufacturing, transport and end-of-life phases (scope 3)
- Being able to assess the impacts of extending the life of the product or using it in one geographical area rather than another.

You can try it on https://dataviz.boavizta.org

### Developing

It needs node 16. see [this url](https://github.com/nodesource/distributions/blob/master/README.md) for installing.

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
