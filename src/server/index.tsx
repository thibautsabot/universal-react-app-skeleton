import express from "express";
import Loadable from "react-loadable";
import { matchRoutes } from "react-router-config";
import store from "../store";
import renderer from "./renderer";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import shrinkRay from "shrink-ray-current";
import { Context, AllRoutes, isSSRComponent, isLodableComponent } from "./types";
import { isFileCompressed } from "./utils";

const webpackDev = require("../../webpack.client.js");
const app = express();

// ------ COMPRESSION CONFIGURATION ------

app.use(shrinkRay());

app.get("*.(js|css)", (req, res, next) => {
    if (
        req.header("Accept-Encoding") &&
        req.header("Accept-Encoding")!.includes("br") &&
        isFileCompressed(req.url, ".br")
    ) {
        if (req.url.endsWith(".css")) {
            // Brotli compression change the Content-Type but it creates a warning for CSS files
            res.set("Content-Type", "text/css; charset=UTF-8");
        }
        req.url = req.url + ".br";
        res.set("Content-Encoding", "br");
    } else if (isFileCompressed(req.url, ".gz")) {
        // Fallback to Gzip
        req.url = req.url + ".gz";
        res.setHeader("Content-Encoding", "gzip");
    }
    next();
});

// ------ CACHE CONFIGURATION ------

const maxAge = 36000000;

app.use(
    express.static("public", {
        maxAge,
        setHeaders: function(res) {
            res.setHeader("Cache-Control", `max-age=${maxAge}`);
        }
    })
);

// ------ HOT RELOAD CONFIGURATION ------

const config = webpackDev;
const compiler = webpack(config);
const options = {
    serverSideRender: true,
    stats: {
        colors: true
    },
    publicPath: "/"
};
app.use(webpackDevMiddleware(compiler, options));
app.use(webpackHotMiddleware(compiler));

// Do "hot-reloading" of react stuff on the server
compiler.plugin("done", () => {
    Object.keys(require.cache).forEach((id) => {
        if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
});

// ------ SSR ------

app.get("*", async (req, res) => {
    const componentsToLoad = matchRoutes(AllRoutes, req.path).map(async ({ route }) => {
        // We need to preload matched components to check if they have a 'serverFetch' method
        return route && isLodableComponent(route.component)
            ? (route.component.preload() as any).then((res: any) => res.default) // `any` because react-lodable made preload `void` on purpose to not wait for it.
            : route.component;
    });

    const loadedComponents = await Promise.all(componentsToLoad);

    // Once components are preloaded, pre-fetch datas if component needs it
    const fetchingActions = loadedComponents
        .map((component) => {
            return component && isSSRComponent(component) ? component.serverFetch(store) : component;
        })
        .map((promise) => {
            // Wrap every promise inside another one that always resolve
            // So when one of the preload fails, the promise.all doesn't stop
            if (promise && Promise.resolve(promise) == promise) {
                return new Promise((resolve) => {
                    promise.then(resolve).catch(resolve);
                });
            }
            return {};
        });

    await Promise.all(fetchingActions);

    const context: Context = {};
    const content = renderer(req, context, store);
    if (context.url) {
        return res.redirect(302, context.url);
    } else if (context.notFound) {
        res.status(404);
    }
    res.send(content);
});

Loadable.preloadAll().then(() => {
    app.listen(4000, () => {
        console.log("Listening on port 4000");
    });
});
