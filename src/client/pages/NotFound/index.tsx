import React from "react";

interface staticContextInterface {
    notFound?: boolean;
}

export default ({ staticContext = {} }: { staticContext: staticContextInterface }) => {
    staticContext.notFound = true;
    return <h1>Ooops, route not found.</h1>;
};
