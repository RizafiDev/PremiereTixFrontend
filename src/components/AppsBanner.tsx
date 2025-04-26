import Playstore from "../../public/logo/playstore.png";
import Appstore from "../../public/logo/appstrore.png";

function AppsBanner() {
  return (
    <div className="container mx-auto w-full px-4 text-textprimary dark:text-white">
      <div className="sub-containr gap-4 md:flex-row flex-col bg-gradient-to-r from-[#557981] to-[#103c45] flex items-center justify-between rounded-2xl py-6 md:py-3 px-8 md:px-16">
        <div className="left font-semibold text-center md:text-start text-xl md:text-2xl text-white">
          Download PremiereTix Apps buat fitur terbaik!
        </div>
        <div className="logo flex items-center gap-2">
          <img src={Playstore} className="w-38" alt="" />
          <img src={Appstore} className="w-30" alt="" />
        </div>
      </div>
    </div>
  );
}
export default AppsBanner;
