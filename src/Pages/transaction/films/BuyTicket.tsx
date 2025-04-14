import { getFilms, Film } from "@/services/filmService";
import { useState, useEffect } from "react";
import { ArrowLeftCircleIcon as BackIcon } from "@heroicons/react/24/solid";
import { BuildingLibraryIcon as CinemaIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import xxi from "../../../../public/XXI.svg"

function BuyTicket() {
  const navigate = useNavigate();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await getFilms();
        setFilms(data);
      } catch (err) {
        setError("Gagal mengambil data film");
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container relative mx-auto overflow-hidden">
      <button className="absolute" onClick={() => navigate("/")}>
        <BackIcon className="size-10 text-white mt-4 ml-20" />
      </button>

      {films.map((film) => (
        <div key={film.id} className="flex flex-col w-full ">
          <div className="banner w-full h-64 overflow-hidden shadow-md">
            <img
              src={film.photo}
              alt={film.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="description pb-12 -my-12 z-50 flex items-end gap-5 justify-center">
            <img
              src={film.photo}
              className="w-56 aspect-9/12 rounded-3xl shadow-xs object-cover"
              alt=""
            />
            <div className="text flex flex-col items-start gap-2 pb-4">
              <h2 className="font-bold text-5xl">{film.title}</h2>
              <p className="text-gray-500">
                Description:{" "}
                <span className="text-black">{film.description}</span>
              </p>
              <p className="text-gray-500">
                Genre:{" "}
                {film.genres.map((g, i) => (
                  <span key={g.id} className="text-black mr-2">
                    {g.genre}
                    {i < film.genres.length - 1 && ","}
                  </span>
                ))}
              </p>
              <p className="text-gray-500">
                Country: <span className="text-black">{film.country}</span>
              </p>
              <p className="text-gray-500">
                Rating: <span className="text-black ">{film.rating}</span>
              </p>
            </div>
          </div>
          <div className="schedule flex flex-col mt-8 px-24 items-start w-full gap-4">
            <div className="header flex">
              <p className="font-bold text-4xl ">Schedule</p>
            </div>
            <div className="date-pick w-full">
              <div className="overflow-x-auto -mx-4 px-4">
                <ul className="flex items-center gap-2 pb-4" id="date-scroller">
                  {/* active */}
                  <li className="flex flex-col items-center font-semibold -space-y-1 bg-black py-2 w-23 rounded-sm text-white cursor-pointer">
                    <p className="text-xs">14 Apr</p>
                    <p className="">TODAY</p>
                  </li>
                  {/* passive */}
                  <li className="flex flex-col items-center font-semibold -space-y-1 border border-black py-2 w-23 rounded-sm text-black cursor-pointer">
                    <p className="text-xs">15 Apr</p>
                    <p className="">TUE</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="cinema-option w-full">
              <ul className="grid grid-cols-2 w-full gap-8">
                <li className="flex w-full border border-black py-5 px-8 rounded-2xl flex-col gap-3">
                  <div className="header flex items-center justify-between w-full">
                    <div className="title flex items-center gap-2">
                      <CinemaIcon className="size-10 text-black" />
                      <div className="name">
                        <p className="uppercase font-semibold">SOLO PARAGON XXI</p>
                        <p className="uppercase text-xs">JL. YOSODIPURO NO.133</p>
                      </div>
                    </div>
                    <div className="xxi size-8 flex"><img src={xxi} alt="" /></div>
                  </div>
                  <div className="studio price pl-12 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-600">STUDIO 2</p>
                    <p className="text-xs font-semibold text-gray-600">Rp. 35.000</p>

                  </div>
                  <div className="time pl-12">
                    <ul className="flex items-center gap-3">
                      {/* expired/full */}
                      <li className="border border-gray-300 cursor-pointer bg-gray-300 text-gray-500 text-xs font-semibold py-1 px-4 w-fit rounded-sm">12:30
                      </li>
                      {/* avaiable */}
                      <li className="border border-gray-400 cursor-pointer   text-xs font-semibold py-1 px-4 w-fit rounded-sm">12:30
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BuyTicket;
