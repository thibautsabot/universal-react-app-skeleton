import { connect } from "react-redux";
import { Dispatch, Store } from "redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as React from "react";

import { fetchHomeAction } from "./actions";
import Header from "../../components/Header/index";

import "./styles.scss";

interface StateProps {
    home: {
        data: string;
    };
}

interface DispatchProps {
    fetchHome: () => {
        type: string;
        payload: string;
    };
}

class Home extends React.Component<StateProps & DispatchProps> {
    componentDidMount() {
        const { home, fetchHome } = this.props;

        // If we already fetched from the server, don't do it again
        if (!home || !home.data) {
            return fetchHome();
        }
        return;
    }

    helmetHeader() {
        return (
            <Helmet>
                <title>Home Page</title>
                <meta property="og:title" content="Home Page" />
            </Helmet>
        );
    }

    render() {
        return (
            <div className="home">
                {this.helmetHeader()}
                <Header />
                <div>I'm a dummy home component </div>
                <Link to="/about">GO TO ABOUT</Link>
            </div>
        );
    }
}

// Store is coming from the SSR.
// In theory, serverFetch doesn't HAVE to be in the class (could be declared in another file and lazy loaded aswell in 'Routes.tsx')
// This would avoid having to preload() components server side to access this method.
// But because we already lazy-load the component, we might also lazy-load the serverFetch function with it (less (unnecessary) work on the client)
(Home as any).serverFetch = (store: Store) => {
    return store.dispatch(fetchHomeAction());
};

const mapStateToProps = ({ home }: StateProps) => ({
    home
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchHome: () => dispatch(fetchHomeAction())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
