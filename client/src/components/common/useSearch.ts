import { useEffect, useRef, useState } from "react";
import update from "immutability-helper";

interface ResultsContainer<SearchResult> {
  [query: string]: SearchResult[] | undefined;
}

/*
  Returns undefined until the API returns results.
  An empty result list means the API returned no results.
*/

export default function useSearch<SearchResult>(
  sendQuery: (q: string) => Promise<SearchResult[] | null>,
  query: string,
  minQueryLength: number
) {
  const resultsContainer = useRef<ResultsContainer<SearchResult>>({});
  const [, setLastResultsUpdate] = useState(0); // The resultsContainer is not in state, so we need to update something in state to trigger a rerender

  useEffect(() => {
    if (query.length < minQueryLength) return;
    if (resultsContainer.current[query] !== undefined) return; // No need to search

    sendQuery(query).then(results => {
      if (results) {
        resultsContainer.current = updateResultsContainer(
          resultsContainer.current,
          query,
          results
        );
        setLastResultsUpdate(new Date().valueOf());
      }
    });
  }, [query]);

  return bestResults(query, resultsContainer.current);
}

function updateResultsContainer(
  resultsContainer: ResultsContainer<any>,
  query: string,
  results: any[]
) {
  return update(resultsContainer, { [query]: { $set: results } });
}

function bestResults<SearchResult>(
  query: string,
  resultsContainer: ResultsContainer<SearchResult>
) {
  if (resultsContainer[query] !== undefined) return resultsContainer[query];
  let subQuery = query.slice(0, -1);
  while (subQuery.length > 0) {
    if (resultsContainer[subQuery] !== undefined)
      return resultsContainer[subQuery];
    subQuery = subQuery.slice(0, -1);
  }
  return undefined;
}
