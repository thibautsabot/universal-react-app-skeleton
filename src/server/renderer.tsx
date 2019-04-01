import { getBundles } from "react-loadable/webpack";
import { Helmet } from "react-helmet";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import React from "react";
import { renderRoutes } from "react-router-config";
import { renderToString } from "react-dom/server";
import { Request } from "express";
import serialize from "serialize-javascript";
import { StaticRouter } from "react-router-dom";
import { Store } from "redux";
import fs from "fs";

import { getStylesBundles, getVendorBundlesFromManifest, getJSBundles, serviceWorkerScript } from "./utils";
import { AllRoutes, Context } from "./types";

// webpack and react-lodable will generate manifests to map chunk hashes and filenames
const stats = require("../../public/react-loadable.json");
const manifest = require("../../public/manifest.json");

export default (req: Request, context: Context, store: Store) => {
    let modules: string[] = [];

    const app = renderToString(
        <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
            <Provider store={store}>
                <StaticRouter location={req.path} context={context}>
                    <div>{renderRoutes(AllRoutes)}</div>
                </StaticRouter>
            </Provider>
        </Loadable.Capture>
    );

    const bundles = getBundles(stats, modules);
    const helmet = Helmet.renderStatic();

    // Make sure we have a valid title even if we forgot it in the component file
    const title = !!(helmet.title.toComponent() as any) /* React-helmet type are bugged */[0].props.children
        ? helmet.title.toString()
        : "<title>My generic Helmet title</title>";

    const manifestValues = Object.values(manifest as string[]);

    // Force the critical style to be loaded inline (also useful when javascript is disabled)
    // Ideally, the firstCssContent CSS files should also be "preloaded" for other pages
    // But it's not yet possible with webpack 4 / mini-css-extract plugin
    const firstCss = manifestValues.find((man) => man.endsWith(".css"));
    const firstCssContent = firstCss && fs.readFileSync("public/" + firstCss, "utf-8");

    return `
      <!doctype html>
      <html role="main" lang="fr">
        <head>
          <meta name="theme-color" content="#FFFFFF" />
          <meta name="description" content="My Meta Description" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${title}
          ${helmet.meta.toString()}
          ${firstCssContent ? `<style>${firstCssContent}</style>` : ""}
          ${
              /* We shouldn't do render-blocking CSS like this.
                But it's the only way to display the CSS if javascript is disabled */
              getStylesBundles(bundles)
          }
          ${serviceWorkerScript}
        </head>
        <body>
            <script>window.INITIAL_STATE = ${serialize(store.getState())}</script>
            ${getVendorBundlesFromManifest(manifestValues)}
            <div id="app">${app}</div>
            ${getJSBundles(bundles)}
            <script src="${manifest["client.js"]}"></script>
        </body>
      </html>
    `;
};
