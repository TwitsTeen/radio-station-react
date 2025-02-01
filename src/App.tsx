import axios from "axios";
import { useEffect, useState } from "react";

interface Station {
  changeuuid: string;
  stationuuid: string;
  serveruuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
}

const apiUrl = "https://de1.api.radio-browser.info";

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Station[]>([]);

  async function fetchStations() {
    try {
      const response = await axios.get(`${apiUrl}/json/stations/topclick/10`);
      setStations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchStations();
    loadFromFavorites();
  }, []);

  async function searchStations(name: string) {
    try {
      const response = await axios.get(
        `${apiUrl}/json/stations/byname/${name}`
      );
      setStations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function addToFavorite(station: Station) {
    const updatedFavorites = [...favorites, station];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  }

  function loadFromFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }

  function showFavorites() {
    setStations(favorites);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Radio Player</h1>
      <button
        onClick={() => showFavorites()}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold mb-4"
      >
        Show Favorites
      </button>
      <form
        className="w-full max-w-md flex gap-2 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          searchStations(search);
        }}
      >
        <input
          type="text"
          placeholder="Station Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
        >
          Search
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-4">
        Currently playing: {currentStation ? currentStation.name : "None"}
      </h2>
      {currentStation && (
        <audio
          controls
          src={currentStation.url_resolved}
          autoPlay
          className="mb-6"
        ></audio>
      )}
      <ul className="w-full max-w-md">
        {stations.map((station) => (
          <li
            key={station.stationuuid}
            onClick={() => setCurrentStation(station)}
            className="p-4 bg-gray-800 rounded-lg mb-2 cursor-pointer hover:bg-gray-700 transition flex justify-between items-center"
          >
            <h3 className="text-lg font-medium">{station.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToFavorite(station);
              }}
              className="px-2 py-1 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-sm font-semibold"
            >
              Favorite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
