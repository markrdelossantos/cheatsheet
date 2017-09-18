import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import SearchResult from "./SearchResult.jsx";
import {ApolloProvider, ApolloClient, createNetworkInterface, graphql, gql} from "react-apollo";

import styles from "../styles/main.style.js";



export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: null
        }

        const networkInterface = createNetworkInterface({
            uri: "http://192.168.99.100/graphql"
        });

        this.client = new ApolloClient({
            networkInterface: networkInterface
        });
    }

    onKeyPress = (evt) => {
        if(evt.key === "Enter") {
            evt.preventDefault();
            this.onSubmit(evt.target.value);
        }
    }

    onSubmit = (query) => {
        if(query) {
            this.setState({
                query: gql`query {note(id:"${query}") {title,body,tag}}`
            });
        }
    }

    render() {
        const SearchResultWithData = this.state.query ? graphql(this.state.query)(SearchResult) 
                        : () => { return false };

        return (
            <MuiThemeProvider>
                <div id="app_main">
                    <div class="quarterWindow"></div>
                    <Paper id="main_paper" style={styles.paperStyles}>
                        <form>
                            <h1>CheatSheet</h1>
                            Search for Tags <br/>
                            <input type="text" id="actual_search" onKeyPress={evt => this.onKeyPress(evt)}
                            style={{padding: "0px", position: "relative",
                            width: "500px", border: "none", outline: "none",
                            backgroundColor: "rgba(221, 221, 221, 1)", color: "rgba(0, 0, 0, 0.87)", cursor: "inherit",
                            fontStyle: "inherit", fontVariant: "inherit", fontWeight: "inherit", fontStretch: "inherit",
                            fontSize: "45px", lineHeight: "inherit", fontFamily: "inherit", opacity: 1,
                            height: "100%"}}/><br/>
                            <RaisedButton label="Submit" onClick={this.onSubmit}/>
                        </form>
                    </Paper>
                    <ApolloProvider client={this.client}>
                        <SearchResultWithData/>
                    </ApolloProvider>
                </div>
            </MuiThemeProvider>
        );
    }
}
