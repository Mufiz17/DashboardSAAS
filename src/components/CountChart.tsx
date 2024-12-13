"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = () => {
  const [guruCount, setGuruCount] = useState(0);
  const [pesertaCount, setPesertaCount] = useState(0);
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

      const guruResult = await guruResponse.json();
      const pesertaResult = await pesertaResponse.json();

      // Hitung jumlah guru dan peserta
      setGuruCount(guruResult.length);
      setPesertaCount(pesertaResult.length);
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

  const data = [
    {
      name: "Guru",
      count: guruCount,
      fill: "#FAE27C",
    },
    {
      name: "Peserta",
      count: pesertaCount,
      fill: "#C3EBFA",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Total </h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-8">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 items-center">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <h1 className="font-bold">{item.count}</h1>
            <h2 className="text-xs text-gray-300">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountChart;
