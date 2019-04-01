import { About, Home, NotFound } from "./client/components";

export default [
    {
        path: "/",
        component: Home,
        exact: true
    },
    {
        path: "/about",
        component: About,
        exact: true
    },
    {
        path: "*",
        component: NotFound
    }
];
