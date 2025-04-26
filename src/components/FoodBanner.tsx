import Popcorn from "../../public/food/popcorn.png";

function FoodBanner() {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-48 w-full relative">
      {/* Header */}
      <div className="flex  items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Nonton sambil nyemil?!
        </h1>
      </div>
      {/* banner */}
      <div className="w-full flex items-center justify-between bg-linear-to-r/hsl from-indigo-500 to-teal-400 py-3 px-5 md:py-6 md:px-10 rounded-md overflow-hidden relative">
        <div className="left  text-white flex flex-col items-start gap-4">
          <p className="font-semibold max-w-60 md:max-w-72 text-md md:text-xl">
            Cobain makanannya deh, nagih!
          </p>
          <button className="text-md md:text-lg font-semibold bg-black py-2 px-4 rounded-md">
            Pesan sekarang
          </button>
        </div>
        <div className="right absolute -right-5 -bottom-24 md:right-12 md:-bottom-15">
          <img src={Popcorn} className="w-52" alt="" />
        </div>
      </div>
    </div>
  );
}
export default FoodBanner;
