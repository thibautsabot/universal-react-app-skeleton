import Loadable from "react-loadable";
import React from "react";

const loading = () => <div>Loading...</div>;

export const Home = Loadable({
    loader: () => import("./pages/Home"),
    modules: ["./pages/Home"],
    webpack: () => [require.resolveWeak("./pages/Home")] as number[],
    loading
});

export const About = Loadable({
    loader: () => import("./pages/About"),
    modules: ["./pages/About"],
    webpack: () => [require.resolveWeak("./pages/About")] as number[],
    loading
});

export const NotFound = Loadable({
    loader: () => import("./pages/NotFound"),
    modules: ["./pages/NotFound"],
    webpack: () => [require.resolveWeak("./pages/NotFound")] as number[],
    loading
});
