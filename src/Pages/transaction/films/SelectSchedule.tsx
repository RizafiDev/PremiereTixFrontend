import NavbarRaw from "@/components/NavbarRaw"
import Footer from "@/components/Footer";
import Komang from "../../../../public/poster/komang.jpg";
import ScheduleList from "@/components/ScheduleList";
function SelectSchedule()
{
    return(
        <div className="container relative mx-auto w-full bg-transparent flex flex-col dark:bg-gradient-to-br dark:from-black dark:to-[#003b43]">
        <NavbarRaw/>
        <div className="poster w-full h-68  overflow-hidden absolute top-0 left-0">
            <img src={Komang} alt="" className="object-cover opacity-15 h-full w-full mask-gradient"/>
        </div>
        <div className="content w-full mx-auto flex flex-col items-start px-96 mt-44 gap-6">
            <div className="breadcrumbs font-medium text-sm">
                <p>Beranda / Film / <span className="font-semibold">Komang</span></p>
            </div>
            <h1 className="font-bold text-4xl">Detail Film</h1>
            <div className="film-information flex items-center gap-6">
                <img src={Komang} className="rounded-md aspect-3/4 w-40 object-cover" alt="" />
                <div className="desc flex flex-col items-start gap-2">
                    <p className="font-semibold text-4xl">Komang</p>
                    <p className="font-medium ">Don, a chubby boy bullied as "Jumbo", encounters Meri, a spirit seeking help to reunite with her troubled family's spirits. Their journey unfolds.</p>
                    <ul className="flex items-center gap-2">
                        <li className="truncate bg-zinc-200 w-fit py-1 px-3 text-xs font-medium rounded-sm">Romance</li>
                        <li className="truncate bg-zinc-200 w-fit py-1 px-3 text-xs font-medium rounded-sm">Adventure</li>
                    </ul>
                </div>
                <ScheduleList/>
            </div>
        </div>
        <Footer/>
        </div>
    )
}export default SelectSchedule;