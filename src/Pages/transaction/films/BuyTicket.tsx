import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Film } from "@/services/filmService";
import { getSchedules, Schedule } from "@/services/scheduleService";
import dayjs from "dayjs";

function BuyTicket() {
  const location = useLocation();
  const film: Film = location.state?.film;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!film) return;

    const fetchSchedules = async () => {
      try {
        const allSchedules = await getSchedules();
        // Filter schedule berdasarkan film ID
        const filtered = allSchedules.filter((s) => s.film?.id === film.id);
        setSchedules(filtered);
      } catch (error) {
        console.error("Gagal memuat jadwal film:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [film]);

  if (!film) {
    return <p>Film tidak ditemukan. Silakan kembali ke daftar film.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Beli Tiket: {film.title}</h1>
      <img src={film.photo} alt={film.title} className="w-60 rounded-xl mb-4" />
      <p className="text-gray-700 mb-2">{film.description}</p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Rilis:</strong>{" "}
        {new Date(film.release_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Negara:</strong> {film.country}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Rating:</strong> {film.rating}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Genres:</strong>{" "}
        {film.genres.map((g) => (
          <span key={g.id} style={{ color: g.color }} className="mr-2">
            {g.genre}
          </span>
        ))}
      </p>

      {/* Jadwal tayang asli dari API */}
      <h2 className="text-xl font-semibold mb-2">Jadwal Tayang</h2>

      {loading ? (
        <p>Memuat jadwal...</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-500">Belum ada jadwal untuk film ini.</p>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-medium">{schedule.cinema?.name}</p>
              <p className="text-gray-600">
                <strong>Studio:</strong> {schedule.studio || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Jam Tayang:</strong>{" "}
                {dayjs(schedule.show_time).format("DD MMM YYYY, HH:mm")}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  // nanti arahkan ke halaman select seat
                  console.log("Pilih schedule ID:", schedule.id);
                }}
              >
                Pilih Jadwal Ini
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyTicket;
