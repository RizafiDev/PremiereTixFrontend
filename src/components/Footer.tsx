import Logo from "../../public/Premiere.svg";
import LogoColor from "../../public/PremiereColor.svg";
function Footer() {
  return (
    <footer className="container text-textprimary dark:text-white mx-auto  w-full mt-12 px-8">
      <div className="sub-container">
        <div className="brand flex items-center w-full justify-between py-4">
          <img src={Logo} alt="" className="w-26 dark:hidden flex" />
          <img src={LogoColor} alt="" className="w-26 dark:flex hidden" />
          <div className="action flex items-center gap-8">
            <a href="" className=" font-medium">
              Tentang Kami
            </a>
            <p className=" font-medium">|</p>
            <a href="" className=" font-medium">
              Pengaduan
            </a>
            <p className=" font-medium">|</p>
            <a href="" className=" font-medium">
              Karir
            </a>
            <p className=" font-medium">|</p>
            <a href="" className=" font-medium">
              Investor
            </a>
          </div>
        </div>
        <div className="horizontal w-full h-[1px] rounded-full bg-black/10 dark:bg-white/15"></div>
        <div className="Cp text-sm items-center text-center font-medium p-12">
          Copyrights ©2025 RizafiDev All Right Reserved
        </div>
      </div>
    </footer>
  );
}
export default Footer;
