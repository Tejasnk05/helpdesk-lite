import { useCallback, useEffect, useState } from 'react';

// Runs `fetcher` (a function that returns a promise) and tracks the result.
// `fetcher` must be wrapped in useCallback by the caller, so it only changes
// when its inputs change. Whenever it changes, the data is fetched again.
export function useFetch(fetcher) {
  const [reloadCount, setReloadCount] = useState(0);

  // The last request that FINISHED: which request it was, and what came back.
  const [result, setResult] = useState({ fetcher: null, reloadCount: -1, data: null, error: null });

  useEffect(() => {
    // If the inputs change (or the component unmounts) while a request is in
    // flight, that request's answer must be ignored, or a slow old response
    // could overwrite a newer one.
    let ignore = false;

    fetcher()
      .then((data) => ({ data, error: null }))
      .catch((error) => ({ data: null, error }))
      .then((outcome) => {
        if (!ignore) setResult({ fetcher, reloadCount, ...outcome });
      });

    return () => {
      ignore = true;
    };
  }, [fetcher, reloadCount]);

  // We are "loading" whenever the finished request is not the one we want now.
  // Nothing needs to be set to true: it follows from the state.
  const loading = result.fetcher !== fetcher || result.reloadCount !== reloadCount;

  // Lets a page update the data without refetching (e.g. after a PATCH).
  const setData = useCallback((update) => {
    setResult((prev) => ({
      ...prev,
      data: typeof update === 'function' ? update(prev.data) : update,
    }));
  }, []);

  // Calling reload() changes reloadCount, which re-runs the effect above.
  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  return { data: result.data, setData, loading, error: loading ? null : result.error, reload };
}