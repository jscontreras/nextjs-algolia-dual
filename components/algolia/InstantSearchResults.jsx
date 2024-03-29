import { useMemo } from "react";
import { ClearRefinements, CurrentRefinements, DynamicWidgets, RangeInput, SortBy, useSearchBox } from "react-instantsearch";
import {
  Hits,
  Configure,
  Pagination,
  InstantSearch,
} from "react-instantsearch";

// Include only the reset
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";
import { QUERY_UPDATE_EVT, insightsConfig, pubsub, searchClient, searchConfig } from "../../lib/algoliaConfig";
import { HitComponent } from "./HitComponent";
import { CategoryPageSuggestions } from "./CategoryPageSuggestions";
import { RatingMenu } from "./RatingMenu";
import { FacetWidgetPanel, FallbackFacetWidget, transformDynamicFacets } from "./DynamicFacetsWidgets";

/**
 * Virtual SearchBox that receives updates from Autocomplete
 * @param props
 * @returns
 */
function CustomSearchBox({ indexId }) {
  const { refine } = useSearchBox();
  useMemo(() => {
    // Listen to the propagated events and update the app
    pubsub.subscribe(QUERY_UPDATE_EVT, (_msg, data) => {
      if (data.index === indexId) {
        refine(data.query);
      }
    });
  }, [indexId]);

  return <></>;
}

/**
 * Returns the hierarchical menu
 * @param {*} extraSearchParams
 * @returns
 */
function calculateRoot(extraSearchParams) {
  const filter = extraSearchParams.filters ? extraSearchParams.filters.replace('category_page_id:', '').replace(/'/g, '') : null;
  if (filter) {
    const parts = filter.split(' > ');
    if (parts.length >= 1) {
      return parts[0];
    }
    return filter;
  }
  return filter;
}

/**
 * Main InstantSearch results component (receives query from Autocomplete Search Bar).
 */
export const InstantSearchResults = ({ routing, extraSearchParams = {} }) => {
  // Adding a Search Proxy to make sure only tagged requests are being executed
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/
  const searchClientMod = {
    ...searchClient,
    search(requests) {
      return new Promise((resolve, reject) => {
        // All requests should have clickAnalytics at this point
        if (requests[0].params && requests[0].params.analyticsTags) {
          return searchClient.search(requests).then((res) => {
            resolve(res);
          });
        } else {
          return {
            results: {
              hits: []
            }
          }
        }

      });

    },
  };

  return (
    <div className="search-is">
      <span className="search-is__app-id">
        {`<InstantSearch App> (${searchConfig.recordsIndex})`}{" "}
      </span>
      <InstantSearch
        searchClient={searchClientMod}
        indexName={searchConfig.recordsIndex}
        routing={routing}
        // Avoid memory leak
        insights={typeof window !== 'undefined' ? insightsConfig : false}
        // https://www.algolia.com/doc/api-reference/widgets/history-router/js/?client=react#widget-param-cleanurlondispose
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure {...extraSearchParams} hitsPerPage={24} analyticsTags={['web-search']} maxValuesPerFacet={500} />
        <CustomSearchBox indexId={searchConfig.recordsIndex} />
        <CategoryPageSuggestions router={routing} />
        <main>
          <div className="menu">
            <DynamicWidgets facets={['*']} fallbackComponent={FallbackFacetWidget} transformItems={transformDynamicFacets}>
              <FallbackFacetWidget
                attributes={[
                  "hierarchical_categories.lvl0",
                  "hierarchical_categories.lvl1",
                  "hierarchical_categories.lvl2",
                  "hierarchical_categories.lvl3",
                ]}
                separator=" > "
                showMore={true}
              // rootPath={calculateRoot(extraSearchParams)}
              />
              <FacetWidgetPanel attribute={"price.value"}>
                <RangeInput attribute="price.value" />
              </FacetWidgetPanel>

              <FacetWidgetPanel attribute={"reviews.rating"}>
                <RatingMenu attribute="reviews.rating" />
              </FacetWidgetPanel>

            </DynamicWidgets>
          </div>
          <div className="results">
            <div className="ais-sort-by">
              <span>Sort By:</span>
              <SortBy items={searchConfig.sortByIndices} />
            </div>
            <div className="refinements-container">
              <CurrentRefinements transformItems={(items) => {
                return items.map((item) => {
                  if (item.label.includes('hierarchical_categories')) {
                    item.label = 'Category';
                  }
                  return item;
                })
              }} />
              <ClearRefinements />
            </div>
            <Hits hitComponent={HitComponent} />
            <Pagination />
          </div>
        </main>
      </InstantSearch>
    </div>
  );
};

