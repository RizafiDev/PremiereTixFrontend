import NavbarRaw from "@/components/NavbarRaw";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Film } from "@/services/filmService";
import { BuildingLibraryIcon as CinemaIcon } from "@heroicons/react/24/solid";
import {
  getSchedulesByFilm,
  isScheduleFull,
  Schedule,
  Cinema,
} from "@/services/scheduleService";
import { useBookingStore } from "@/stores/useBookingStore";
import { useAuthStore } from "@/stores/useAuthStore";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

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

function SelectSchedule() {
  const location = useLocation();
  const navigate = useNavigate();
  const film: Film = location.state?.film;

  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await initialize();
      if (!isAuthenticated) {
        navigate("/login", { state: { from: "/select-schedule" } });
      }
    };

    checkAuth();
  }, [isAuthenticated, initialize, navigate]);

  // Get state from Zustand store
  const { booking, setBooking } = useBookingStore();

  // If no film in URL state but exists in store, use that
  const currentFilm = film || booking.film;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    booking.showDate || dayjs().format("YYYY-MM-DD")
  );
  const [selectedShowtime, setSelectedShowtime] = useState<{
    id: number | null;
    time: string | null;
    cinema: Cinema | null;
    studio: string | null;
    price: number | null;
  }>({
    id: booking.showtimeId,
    time: booking.showtimeTime,
    cinema: booking.cinema,
    studio: booking.studio,
    price: booking.price,
  });
  const [fullScheduleIds, setFullScheduleIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentFilm) {
      // Save film to store if coming from location state
      if (film && (!booking.film || booking.film.id !== film.id)) {
        setBooking({ film });
      }
      setIsLoading(true);

      getSchedulesByFilm(currentFilm.id).then(async (data) => {
        setSchedules(data);

        const fullChecks = await Promise.all(
          data.map((schedule) => isScheduleFull(schedule.id))
        );

        const fullIds = data
          .filter((_, index) => fullChecks[index])
          .map((s) => s.id);

        setFullScheduleIds(fullIds);
        setIsLoading(false);
      });
    }
  }, [currentFilm, film, booking.film, setBooking]);

  // Get upcoming 7 days
  const upcomingDays = [...Array(5)].map((_, i) => dayjs().add(i, "day"));

  // Filter schedules based on selected date
  const filteredSchedules = schedules.filter(
    (s) => dayjs(s.show_date).format("YYYY-MM-DD") === selectedDate
  );

  // Group schedules by cinema
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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Reset selected showtime when date changes
    setSelectedShowtime({
      id: null,
      time: null,
      cinema: null,
      studio: null,
      price: null,
    });
  };

  const handleShowtimeSelect = (
    id: number,
    time: string,
    showDate: string,
    cinema: Cinema,
    studio: string,
    price: number
  ) => {
    const showtimeTime = `${showDate} ${time}`;

    // Update local state
    setSelectedShowtime({
      id,
      time: showtimeTime,
      cinema,
      studio,
      price,
    });

    // Update store
    setBooking({
      showtimeId: id,
      showtimeTime,
      showDate,
      cinema,
      studio,
      price,
    });
  };

  const handleProceedToSeats = () => {
    if (selectedShowtime.id) {
      navigate("/select-seat");
    } else {
      alert("Pilih jadwal terlebih dahulu!");
    }
  };

  if (!currentFilm)
    return <p>Film tidak ditemukan. Silakan kembali ke daftar film.</p>;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="container relative text-textprimary dark:text-white mx-auto w-full bg-transparent flex flex-col dark:bg-gradient-to-br dark:from-black dark:to-[#003b43]">
      <NavbarRaw />
      <div className="poster w-full h-68 overflow-hidden absolute top-0 left-0">
        <img
          src={currentFilm.photo}
          alt=""
          className="object-cover opacity-15 h-full w-full mask-gradient"
        />
      </div>
      <div className="content w-full mx-auto flex flex-col items-start px-4 md:px-[445px] mt-28 gap-4 md:gap-6">
        <div className="breadcrumbs font-medium text-xs md:text-sm">
          <p>
            Beranda / Film /{" "}
            <span className="font-semibold">{currentFilm.title}</span>
          </p>
        </div>
        <h1 className="font-bold text-2xl md:text-4xl">Detail Film</h1>
        <div className="film-information flex items-center gap-6">
          <img
            src={currentFilm.photo}
            className="rounded-md aspect-3/4 w-40 object-cover"
            alt={currentFilm.title}
          />
          <div className="desc flex flex-col items-start gap-2">
            <p className="font-semibold text-2xl md:text-4xl">{currentFilm.title}</p>
            <p className="font-medium max-w-prose md:text-base text-sm">{currentFilm.description}</p>
            <ul className="flex items-center gap-2 flex-wrap">
              {currentFilm.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="truncate dark:bg-cusprimary/70 bg-zinc-200 w-fit py-1 px-3 text-[10px] md:text-xs font-medium rounded-sm"
                >
                  {genre.genre}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto w-full flex flex-col items-start">
          <div className="action">
            <ul className="flex items-center gap-4">
              <li className="font-semibold text-sm md:text-base  py-4 cursor-pointer border-b-2 border-b-black">
                Jadwal
              </li>
              <li className="font-normal text-sm md:text-base py-4 cursor-pointer">Sinopsis</li>
            </ul>
          </div>
          <div className="w-full h-[1px] bg-gray-400"></div>
          <div className="calendar mt-6 flex items-center gap-4 md:gap-6 flex-wrap">
            {upcomingDays.map((day) => (
              <div
                key={day.format("YYYY-MM-DD")}
                className={`wrapper flex flex-col items-center md:w-16 md:h-18 w-14 h-16 ${
                  selectedDate === day.format("YYYY-MM-DD")
                    ? "bg-textsecondary text-white"
                    : "bg-transparent dark:bg-cusprimary/40 dark:text-white/70 text-textprimary/30"
                } px-3 py-2 rounded-md cursor-pointer`}
                onClick={() => handleDateSelect(day.format("YYYY-MM-DD"))}
              >
                <p className="text-sm md:text-base font-normal">{day.format("ddd")}</p>
                <p className="text-base md:text-xl font-bold">{day.format("D")}</p>
              </div>
            ))}
          </div>
          <div className="schedule-wrap flex flex-col items-start w-full gap-4 mt-6">
            {groupedSchedules.length > 0 ? (
              groupedSchedules.map((cinemaGroup) => {
                // Group by studio
                const studioGroups = cinemaGroup.showtimes.reduce<
                  Record<string, StudioGroup>
                >((studios, show) => {
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
                }, {});

                return (
                  <div
                    key={cinemaGroup.cinema.id}
                    className="item-wrapper flex flex-col w-full dark:bg-cusprimary/40 bg-white/70 p-8 rounded-xl gap-4"
                  >
                    <div className="top flex items-center gap-6">
                      <CinemaIcon className="size-7 text-textprimary dark:text-white" />
                      <p className="font-semibold text-lg md:text-xl uppercase">
                        {cinemaGroup.cinema.name}
                      </p>
                    </div>
                    <div className="w-full h-[1px] bg-gray-300"></div>

                    {Object.entries(studioGroups).map(
                      ([studioKey, studioData]) => {
                        const sortedTimes = [...studioData.times].sort(
                          (a, b) => {
                            return dayjs(`${a.showDate} ${a.time}`).isBefore(
                              dayjs(`${b.showDate} ${b.time}`)
                            )
                              ? -1
                              : 1;
                          }
                        );

                        return (
                          <div key={studioKey} className="studio-section mb-4">
                            <div className="information flex items-center w-full justify-between">
                              <p className="font-semibold md:text-base text-sm">
                                Studio {studioData.studio}
                              </p>
                              <p className="font-semibold md:text-base text-sm">
                                Rp
                                {Number(studioData.price).toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                            <div className="clock grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full gap-4 mt-2">
                              {sortedTimes.map((timeInfo) => {
                                const showTimeFull = `${timeInfo.showDate} ${timeInfo.time}`;
                                const isPast = dayjs().isAfter(
                                  dayjs(showTimeFull)
                                );
                                const isSelected =
                                  selectedShowtime.id === timeInfo.id;

                                return (
                                  <p
                                    key={timeInfo.id}
                                    className={`font-semibold md:p-4 p-2 rounded-md text-sm md:text-base text-center ${
                                      isPast || timeInfo.isFull
                                        ? "text-textprimary/20 bg-textprimary/5 cursor-not-allowed"
                                        : isSelected
                                        ? "bg-textsecondary text-white cursor-pointer"
                                        : "bg-textprimary/5 cursor-pointer"
                                    }`}
                                    onClick={() =>
                                      !isPast &&
                                      !timeInfo.isFull &&
                                      handleShowtimeSelect(
                                        timeInfo.id,
                                        timeInfo.time,
                                        timeInfo.showDate,
                                        cinemaGroup.cinema,
                                        studioData.studio,
                                        studioData.price
                                      )
                                    }
                                  >
                                    {dayjs(
                                      `${timeInfo.showDate} ${timeInfo.time}`,
                                      "YYYY-MM-DD HH:mm:ss"
                                    ).format("HH:mm")}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center w-full py-6">
                Tidak ada jadwal tersedia untuk tanggal ini
              </p>
            )}
          </div>
          <div className="actions w-full mt-8">
            <button
              onClick={handleProceedToSeats}
              className={`w-full py-2 md:py-3 rounded-lg md:text-base text-sm ${
                selectedShowtime.id
                  ? "bg-textsecondary text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedShowtime.id}
            >
              Pilih Kursi
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SelectSchedule;
