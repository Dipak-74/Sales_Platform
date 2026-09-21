import { useEffect, useState } from "react";

export function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetcher();

        if (active) {
          setData(response?.data ?? response ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || "Something went wrong.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, dependencies);

  return { data, loading, error };
}
