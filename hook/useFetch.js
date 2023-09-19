import { useState, useEffect } from 'react';
import axios from 'axios';
import { RAPID_API_KEY } from '@env';

const rapidApiKey = process.env.RAPID_API_KEY;

const useFetch = (endpoint, query) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = {
        method: 'GET',
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        params: { ...query },
      };

      const fetchData = async (retries = 3, delay = 500) => {
        setIsLoading(true);
        try {
            const response = await axios.request(options);
            setData(response.data.data);
            setIsLoading(false);
          } catch (error) {
            if (error.response && error.response.status === 429 && retries > 0) {
              setTimeout(() => {
                fetchData(retries - 1, delay * 2);
              }, delay);
            } else {
              setError(error);
              alert("There is an error");
            }
          } finally {
            setIsLoading(false);
          }
        }
    //     try {
    //         const response = await axios.request(options);
    //         setData(response.data.data);
    //         setIsLoading(false);
    //     } catch (error) {
    //         setError(error);
    //         alert("There is an error")
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

        useEffect(() => {
            fetchData();
        }, []);

        const refetch = () => {
            setIsLoading(true);
            fetchData();
        }

        return { data, isLoading, error, refetch };
}

export default useFetch;
