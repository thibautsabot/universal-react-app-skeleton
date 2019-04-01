# Overview

This is an overkill React application skeleton with the following features :

- TypeScript support
- PWA (with full offline support)
- Code splitting / Lazy loading (with react-lodable and webpack 4)
- Server Side Rendering (with express and redux)
- SEO (with react-helmet)
- "Disabled JavaScript" support
- Hot Module Reload (dev build)
- Compression with brotli / Gzip

When HTTPs is enabled lighthouse shows 100 points for each section

It was inspired from the minimal https://github.com/thibautsabot/react-typescript-boilerplate

# How to run

Client : `NODE_ENV=production yarn build-client`

Server : `NODE_ENV=production yarn build-server`

Start : `yarn start`

The differences between dev and prod build are :
HMR support (dev), named hash (prod), splitted CSS file (prod)

You can run `ANALYZE=true yarn build-client` to open a bundle analyzer webpage
