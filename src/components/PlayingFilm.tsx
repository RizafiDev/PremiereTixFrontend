import { ArrowRightCircleIcon as SemuaIcon } from "@heroicons/react/24/outline";
import FilmList from "@/components/custom/FilmList";

function PlayingFilm() {
  return (
    <div className="container mx-auto px-16 py-10 shadow-sm bg-white flex flex-col  gap-8">
      <div className="heading flex justify-between items-center">
        <div className="left flex flex-col items-start space-y-3">
          <h1 className="text-2xl font-bold">Sedang Tayang</h1>
          <div className="semua flex items-center space-x-2">
            <button className="text-xs font-medium text-blue-600 rounded-full border border-blue-600 px-4 py-1">
              Semua Genre
            </button>
            <button className="text-xs font-medium text-black rounded-full border border-gray-200 px-4 py-1">
              Horror
            </button>
            <button className="text-xs font-medium text-black rounded-full border border-gray-200 px-4 py-1">
              Romance
            </button>
            <button className="text-xs font-medium text-black rounded-full border border-gray-200 px-4 py-1">
              Adventure
            </button>
          </div>
        </div>
        <div className="right flex items-center ">
          <button className="text-sm font-medium text-black flex items-center gap-1">
            Semua <SemuaIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <FilmList />
    </div>
  );
}
export default PlayingFilm;
