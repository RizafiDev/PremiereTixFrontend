import Theater1 from "../../public/theater/t1.jpg";
import Theater2 from "../../public/theater/t2.jpg";
import Theater3 from "../../public/theater/t3.jpg";

function StudioOverview() {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-48 w-full relative text-textprimary dark:text-white">
      <div className="header flex  items-center mb-4">
        <h1 className="text-2xl font-bold">Tentang studio kami</h1>
      </div>
      <div className="container-grid grid grid-cols-3 w-full gap-4 h-52">
        {/* first */}
        <div className="relative w-full h-full overflow-hidden rounded-md p-4 justify-between flex flex-col items-start group">
          <img
            src={Theater1}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-600 ease-in-out group-hover:scale-110"
            alt=""
          />
          <div className="top relative text-white/80 z-10 flex flex-col items-start gap-2">
            <p className="font-semibold text-xl">Regular Theater</p>
            <p className="font-normal text-sm">
              Studio standar dengan kursi biasa, cocok untuk penonton kasual.
            </p>
          </div>
          <button className="text-sm font-medium relative z-10 bg-black text-white px-3 py-2 cursor-pointer hover:bg-gray-800 transition-all rounded-md">
            Selengkapnya
          </button>
        </div>
        {/* first */}
        <div className="relative w-full h-full overflow-hidden rounded-md p-4 justify-between flex flex-col items-start group">
          <img
            src={Theater2}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-600 ease-in-out group-hover:scale-110"
            alt=""
          />
          <div className="top relative text-white/80 z-10 flex flex-col items-start gap-2">
            <p className="font-semibold text-xl">Premium Theater</p>
            <p className="font-normal text-sm">
              Kursi recliner nyaman, suara jernih, layar lebih besar.
            </p>
          </div>
          <button className="text-sm font-medium relative z-10 bg-black text-white px-3 py-2 cursor-pointer hover:bg-gray-800 transition-all rounded-md">
            Selengkapnya
          </button>
        </div>
        {/* first */}
        <div className="relative w-full h-full overflow-hidden rounded-md p-4 justify-between flex flex-col items-start group">
          <img
            src={Theater3}
            className="absolute brightness-30 inset-0 w-full h-full object-cover z-0 transition-transform duration-600 ease-in-out group-hover:scale-110"
            alt=""
          />
          <div className="top relative text-white/80 z-10 flex flex-col items-start gap-2">
            <p className="font-semibold text-xl">Deluxe Theater</p>
            <p className="font-normal text-sm">
              Kursi sofa mewah, selimut, layanan makanan langsung ke tempat
              duduk.
            </p>
          </div>
          <button className="text-sm font-medium relative z-10 bg-black text-white px-3 py-2 cursor-pointer hover:bg-gray-800 transition-all rounded-md">
            Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
}
export default StudioOverview;
