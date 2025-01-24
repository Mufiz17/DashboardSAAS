"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Person = {
  status: string;
};

const AttendanceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API guru dan peserta
  const fetchData = async () => {
    try {
      const [guruResponse, pesertaResponse] = await Promise.all([
        fetch("http://localhost:5000/guru"),
        fetch("http://localhost:5000/peserta"),
      ]);

      if (!guruResponse.ok || !pesertaResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const guruResult: Person[] = await guruResponse.json();
      const pesertaResult: Person[] = await pesertaResponse.json();

      // Hitung jumlah `active` dan `inactive`
      const guruActive = guruResult.filter((item: Person) => item.status === "Aktif").length;
      const guruInactive = guruResult.filter((item: Person) => item.status === "Tidak Aktif").length;
      const pesertaActive = pesertaResult.filter((item: Person) => item.status === "Aktif").length;
      const pesertaInactive = pesertaResult.filter((item: Person) => item.status === "Tidak Aktif").length;

      // Gabungkan data
      setData([
        { category: "Aktif", Guru: guruActive, Peserta: pesertaActive },
        { category: "Tidak Aktif", Guru: guruInactive, Peserta: pesertaInactive },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Active Status</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Guru" fill="#FAE27C" name="Guru" barSize={20} />
          <Bar dataKey="Peserta" fill="#C3EBFA" name="Peserta" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
