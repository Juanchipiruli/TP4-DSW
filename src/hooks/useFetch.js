import { useState, useEffect } from 'react';

export const useFetch = ({url = "", options = {}, autoFetch = true}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(response);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!autoFetch) return;

    fetchData();
  }, [url]);

  const refetch = async ({url: newUrl = url, options: newOptions = {}}) => {
    setLoading(true);
    try {
      const response = await fetch(newUrl, newOptions);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};