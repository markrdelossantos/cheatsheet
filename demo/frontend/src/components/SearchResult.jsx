import React from "react";
import Paper from "material-ui/Paper";

import styles from "../styles/main.style.js";


export default class SearchResult extends React.Component {

    generateContent(note) {
        const tags = note.tag.map( (tag) => {
            return (<div>{tag}</div>);
        });
        return (
            <div>
                <div>{note.title}</div>
                <div>{note.body}</div>
                {tags}
            </div>
        );
    }

    render() {
        const loading = <div>Loading...</div>;
        const result = this.props.data;

        const content = result.networkStatus !== 1 && result.note ? 
                this.generateContent(result.note) : loading;

        return (
            <Paper style={styles.searchResultPaperStyles} id="search_result">
                <h3>Search Results</h3>
                {content}
            </Paper>
        );
    }
}