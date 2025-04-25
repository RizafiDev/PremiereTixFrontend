import { ArrowRightCircleIcon as SemuaIcon } from "@heroicons/react/24/outline";
import FilmList from "@/components/custom/FilmList";
import FilmCatalog from "./custom/FilmCatalog";

function PlayingFilm() {
  return (
    <div className="container bg-transparent mx-auto px-48   text-textprimary dark:text-white flex flex-col  gap-8">
      <div className="heading flex justify-between items-center">
        <div className="left flex flex-col items-start space-y-3">
          <h1 className="text-2xl font-bold">Sedang Tayang</h1>
        </div>
        <div className="right flex items-center ">
          <button className="text-sm font-medium text-textsecondary flex items-center gap-1">
            Semua <SemuaIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* <FilmList /> */}
      <FilmCatalog />
    </div>
  );
}
export default PlayingFilm;
