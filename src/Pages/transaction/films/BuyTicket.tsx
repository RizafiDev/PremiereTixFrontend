import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Film } from "@/services/filmService";
import {
  ArrowLeftCircleIcon as BackIcon,
  BuildingLibraryIcon as CinemaIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import {
  getSchedulesByFilm,
  isScheduleFull,
  Schedule,
  Cinema,
} from "@/services/scheduleService";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import xxi from "../../../../public/XXI.svg";


dayjs.extend(isBetween);

interface GroupedShowtime {
  id: number;
  time: string;
  showDate: string;
  studio: string;
  price: number;
  isFull: boolean;
}

interface StudioGroup {
  studio: string;
  price: number;
  times: Array<{
    id: number;
    time: string;
    showDate: string;
    isFull: boolean;
  }>;
}

interface CinemaGroup {
  cinema: Cinema;
  showtimes: GroupedShowtime[];
}

function BuyTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const film: Film = location.state?.film;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullScheduleIds, setFullScheduleIds] = useState<number[]>([]);

  useEffect(() => {
    if (film) {
      getSchedulesByFilm(film.id).then(async (data) => {
        setSchedules(data);

        const fullChecks = await Promise.all(
          data.map((schedule) => isScheduleFull(schedule.id))
        );

        const fullIds = data
          .filter((_, index) => fullChecks[index])
          .map((s) => s.id);

        setFullScheduleIds(fullIds);
      });
    }
  }, [film]);

  if (!film)
    return <p>Film tidak ditemukan. Silakan kembali ke daftar film.</p>;

  const upcomingDays = [...Array(7)].map((_, i) => dayjs().add(i, "day"));

  const filteredSchedules = schedules.filter(
    (s) => dayjs(s.show_date).format("YYYY-MM-DD") === selectedDate
  );

  const groupedByCinema = filteredSchedules.reduce<Record<number, CinemaGroup>>(
    (grouped, schedule) => {
      const cinemaId = schedule.cinema?.id || 0;

      if (!grouped[cinemaId]) {
        grouped[cinemaId] = {
          cinema: schedule.cinema as Cinema,
          showtimes: [],
        };
      }

      grouped[cinemaId].showtimes.push({
        id: schedule.id,
        time: schedule.show_time,
        showDate: schedule.show_date,
        studio: schedule.studio,
        price: schedule.price || 0,
        isFull: fullScheduleIds.includes(schedule.id),
      });

      return grouped;
    },
    {}
  );

  const groupedSchedules = Object.values(groupedByCinema);

  return (
    <div className="container relative mx-auto overflow-hidden">
      <button className="absolute" onClick={() => navigate("/")}>
        <BackIcon className="size-10 text-white mt-4 ml-20" />
      </button>
      <button
        onClick={() => navigate("/select-seat")}
        className={`flex items-center font-semibold gap-2 w-full justify-center py-4 fixed bottom-0 right-0 ${
          selectedTime
            ? "bg-black text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!selectedTime}
      >
        <TicketIcon className="size-6" />
        CHECKOUT
      </button>

      {/* Banner dan deskripsi film */}
      <div className="flex flex-col w-full">
        <div className="banner w-full h-64 overflow-hidden shadow-md">
          <img
            src={film.photo}
            alt={film.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="description pb-12 -my-12 z-50 flex items-end gap-5 justify-start ml-24">
          <img
            src={film.photo}
            className="w-56 aspect-9/12 rounded-3xl shadow-xs object-cover"
            alt=""
          />
          <div className="text flex flex-col items-start gap-2 pb-4">
            <h2 className="font-bold text-5xl">{film.title}</h2>
            <p className="text-gray-500 max-w-[1100px]">
              Description: <span className="text-black">{film.description}</span>
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
              Rating: <span className="text-black">{film.rating}</span>
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="schedule flex flex-col mt-8 px-24 items-start w-full gap-4 mb-24">
          <div className="header flex">
            <p className="font-bold text-4xl ">Schedule</p>
          </div>

          <div className="date-pick w-full">
            <ul className="flex items-center gap-2 pb-4">
              {upcomingDays.map((d) => (
                <li
                  key={d.format("YYYY-MM-DD")}
                  className={`flex flex-col items-center font-semibold -space-y-1 py-2 w-23 rounded-sm cursor-pointer ${
                    selectedDate === d.format("YYYY-MM-DD")
                      ? "bg-black text-white"
                      : "border border-black text-black"
                  }`}
                  onClick={() => setSelectedDate(d.format("YYYY-MM-DD"))}
                >
                  <p className="text-xs">{d.format("DD MMM")}</p>
                  <p className="">{d.format("ddd").toUpperCase()}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="cinema-option w-full">
            <ul className="grid grid-cols-2 w-full gap-8">
              {groupedSchedules.map((cinemaGroup) => (
                <li
                  key={cinemaGroup.cinema?.id}
                  className="flex w-full border border-black py-5 px-8 rounded-2xl flex-col gap-3"
                >
                  <div className="header flex items-center justify-between w-full">
                    <div className="title flex items-center gap-2">
                      <CinemaIcon className="size-10 text-black" />
                      <div className="name">
                        <p className="uppercase font-semibold">
                          {cinemaGroup.cinema?.name}
                        </p>
                        <p className="uppercase text-xs">
                          {cinemaGroup.cinema?.address}
                        </p>
                      </div>
                    </div>
                    <div className="xxi size-8 flex">
                      <img src={xxi} alt="" />
                    </div>
                  </div>

                  {/* Jadwal dikelompokkan per studio */}
                  {Object.entries(
                    cinemaGroup.showtimes.reduce<Record<string, StudioGroup>>(
                      (studios, show) => {
                        if (!studios[show.studio]) {
                          studios[show.studio] = {
                            studio: show.studio,
                            price: show.price,
                            times: [],
                          };
                        }
                        studios[show.studio].times.push({
                          id: show.id,
                          time: show.time,
                          showDate: show.showDate,
                          isFull: show.isFull,
                        });
                        return studios;
                      },
                      {}
                    )
                  ).map(([studioKey, studioData]) => {
                    const sortedTimes = [...studioData.times].sort((a, b) => {
                      return dayjs(`${a.showDate} ${a.time}`).isBefore(
                        dayjs(`${b.showDate} ${b.time}`)
                      )
                        ? -1
                        : 1;
                    });

                    return (
                      <div key={studioKey} className="studio-section">
                        <div className="studio price pl-12 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            STUDIO {studioData.studio}
                          </p>
                          <p className="text-xs font-semibold text-gray-600">
                            Rp {Number(studioData.price).toLocaleString("id-ID")},-
                          </p>
                        </div>

                        <div className="time pl-12">
                          <ul className="flex items-center gap-3 flex-wrap">
                            {sortedTimes.map((timeInfo) => {
                              const showTimeFull = `${timeInfo.showDate} ${timeInfo.time}`;
                              const isPast = dayjs().isAfter(
                                dayjs(showTimeFull)
                              );

                              return (
                                <li
                                  key={timeInfo.id}
                                  className={`border text-xs font-semibold py-1 px-4 w-fit rounded-sm ${
                                    isPast || timeInfo.isFull
                                      ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                                      : selectedTime === showTimeFull
                                      ? "bg-black text-white border-black"
                                      : "border-gray-400 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    !isPast &&
                                    !timeInfo.isFull &&
                                    setSelectedTime(showTimeFull)
                                  }
                                >
                                  {dayjs(
                                    `${timeInfo.showDate} ${timeInfo.time}`,
                                    "YYYY-MM-DD HH:mm:ss"
                                  ).format("HH:mm")}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyTicket;
