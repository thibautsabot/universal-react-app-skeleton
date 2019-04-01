import { Component } from "react";
import { LoadableComponent } from "react-loadable";
import { RouteConfig } from "react-router-config";
import { Store } from "redux";
import routes from "../routes";

// We need to cast it because we are using LoadedComponent from react-lodable
export const AllRoutes = routes as RouteConfig[];
export interface Context {
    url?: string;
    notFound?: string;
}

export interface SSRComponent extends Component {
    serverFetch: (
        store: Store
    ) => {
        type: string;
        payload: string;
    };
}

export const isLodableComponent = (comp: LoadableComponent | any): comp is LoadableComponent => {
    return comp.hasOwnProperty("preload");
};

export const isSSRComponent = (comp: SSRComponent | any): comp is SSRComponent => {
    return comp.hasOwnProperty("serverFetch");
};
