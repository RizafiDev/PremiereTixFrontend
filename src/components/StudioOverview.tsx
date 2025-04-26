import Theater1 from "../../public/theater/t1.jpg";
import Theater2 from "../../public/theater/t2.jpg";
import Theater3 from "../../public/theater/t3.jpg";

function StudioOverview() {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-48 w-full relative text-textprimary dark:text-white">
      {/* Header */}
      <div className="flex items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Tentang studio kami</h1>
      </div>

      {/* Container */}
      <div className="flex md:grid md:grid-cols-3 w-full gap-4 overflow-x-auto h-72 md:h-52">
        {/* Card */}
        {[Theater1, Theater2, Theater3].map((theater, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 md:flex-shrink w-64 md:w-full h-full overflow-hidden rounded-md p-4 justify-between flex flex-col items-start group"
          >
            <img
              src={theater}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-600 ease-in-out group-hover:scale-110"
              alt=""
            />
            <div className="relative text-white/80 z-10 flex flex-col items-start gap-2">
              <p className="font-semibold text-lg md:text-xl">
                {idx === 0
                  ? "Regular Theater"
                  : idx === 1
                  ? "Premium Theater"
                  : "Deluxe Theater"}
              </p>
              <p className="font-normal text-sm">
                {idx === 0
                  ? "Studio standar dengan kursi biasa, cocok untuk penonton kasual."
                  : idx === 1
                  ? "Kursi recliner nyaman, suara jernih, layar lebih besar."
                  : "Kursi sofa mewah, selimut, layanan makanan langsung ke tempat duduk."}
              </p>
            </div>
            <button className="text-sm font-medium relative z-10 bg-black text-white px-3 py-2 cursor-pointer hover:bg-gray-800 transition-all rounded-md">
              Selengkapnya
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudioOverview;
