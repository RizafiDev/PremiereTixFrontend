import Logo from "../../public/Premiere.svg";
import LogoColor from "../../public/PremiereColor.svg";
function Footer() {
  return (
    <footer className="container text-textprimary dark:text-white mx-auto  w-full  md:mt-12 px-8">
      <div className="sub-container">
        <div className="brand flex md:flex-row flex-col items-start md:items-center w-full justify-between py-4">
          <img
            src={Logo}
            alt=""
            className="w-26 dark:hidden flex -ml-3 md:ml-0"
          />
          <img
            src={LogoColor}
            alt=""
            className="w-26 dark:flex hidden -ml-3 md:ml-0"
          />
          <div className="action flex md:flex-row flex-col md:items-center gap-4 md:gap-8">
            <a href="" className=" font-medium">
              Tentang Kami
            </a>
            <p className=" font-medium hidden md:flex">|</p>
            <a href="" className=" font-medium">
              Pengaduan
            </a>
            <p className=" font-medium hidden md:flex">|</p>
            <a href="" className=" font-medium">
              Karir
            </a>
            <p className=" font-medium hidden md:flex">|</p>
            <a href="" className=" font-medium">
              Investor
            </a>
          </div>
        </div>
        <div className="horizontal w-full h-[1px] rounded-full bg-black/10 dark:bg-white/15"></div>
        <div className="Cp text-sm items-center  md:text-center font-medium py-12">
          Copyrights ©2025 RizafiDev All Right Reserved
        </div>
      </div>
    </footer>
  );
}
export default Footer;
