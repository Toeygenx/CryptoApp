"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

interface Crypto {
  id: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  market_cap: number;
  current_price: number;
  total_supply: number;
  total_volume: number;
  image: string;
}

export default function CryptoTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        console.error(err);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredCryptoData = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-100 to-white text-gray-900"
      }`}
    >
      <header
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-green-400 to-blue-500"
            : "bg-gradient-to-r from-green-200 to-blue-300"
        } py-6 flex justify-between items-center px-4 sm:px-6 lg:px-8`}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white flex-grow">
          Crypto Currency App
        </h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            isDarkMode
              ? "bg-gray-800 text-yellow-400"
              : "bg-gray-200 text-gray-800"
          }`}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </button>
      </header>

      <main className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-8 w-full max-w-2xl mx-auto">
          <label htmlFor="search" className="sr-only">
            Search cryptocurrencies
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search cryptocurrencies..."
            className={`w-full px-4 py-2 rounded-md ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
            } border focus:border-green-400 focus:ring focus:ring-green-400 focus:ring-opacity-50`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="text-center">
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p
              className={`text-xl ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex-grow overflow-auto">
            <div className="inline-block min-w-full align-middle">
              <div
                className={`overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <table
                  className={`min-w-full divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      {[
                        "Rank",
                        "Name",
                        "Symbol",
                        "Market Cap",
                        "Price",
                        "Total Supply",
                        "Volume(24hr)",
                      ].map((header, index) => (
                        <th
                          key={header}
                          scope="col"
                          className={`px-3 py-3.5 text-left text-sm font-semibold ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-200"
                              : "bg-gray-100 text-gray-900"
                          } ${index === 0 ? "sm:pl-6" : ""} ${
                            ["Symbol", "Market Cap"].includes(header)
                              ? "hidden sm:table-cell"
                              : ""
                          } ${
                            header === "Total Supply"
                              ? "hidden lg:table-cell"
                              : ""
                          } ${
                            header === "Volume(24hr)"
                              ? "hidden xl:table-cell"
                              : ""
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode
                        ? "divide-gray-700 bg-gray-900"
                        : "divide-gray-200 bg-white"
                    }`}
                  >
                    {filteredCryptoData.map((crypto) => (
                      <tr
                        key={crypto.id}
                        className={
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }
                      >
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } sm:pl-6`}
                        >
                          {crypto.market_cap_rank}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            <img
                              src={crypto.image}
                              alt=""
                              className="h-6 w-6 rounded-full"
                            />
                            <span
                              className={`ml-2 font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {crypto.name}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } hidden sm:table-cell`}
                        >
                          {crypto.symbol.toUpperCase()}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } hidden md:table-cell`}
                        >
                          $
                          {crypto.market_cap.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">
                          $
                          {crypto.current_price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } hidden lg:table-cell`}
                        >
                          {crypto.total_supply
                            ? crypto.total_supply.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })
                            : "N/A"}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } hidden xl:table-cell`}
                        >
                          $
                          {crypto.total_volume.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
