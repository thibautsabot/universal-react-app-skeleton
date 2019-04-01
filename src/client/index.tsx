import { BrowserRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { renderRoutes, RouteConfig } from "react-router-config";

import store from "../store";
import routes from "../routes";

Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <div>{renderRoutes(routes as RouteConfig[])}</div>
            </BrowserRouter>
        </Provider>,
        document.querySelector("#app")
    );
});

if (module.hot) {
    module.hot.accept();
}
