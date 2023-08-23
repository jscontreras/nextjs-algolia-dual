import React from "react";
import { AutocompleteSearchBar } from "../../components/algolia/AutocompleteSearchBar";
import { searchConfig } from "../../lib/algoliaConfig";

/**
 * Main Page Prototype.
 * @returns
 */
export default function NonSearchPage() {
  return <div className="page_container">
    <AutocompleteSearchBar />
      <div className=" page_content" >
        <h1>Hello World</h1>
        <br></br>
        <h2>This is any other page different than {searchConfig.searchPagePath} or any category (catalog) page.</h2>
        <br></br>
        <p>Upon search, the user will be redirected to the search page passing the query as an URL value.</p>
      </div>
  </div>

}