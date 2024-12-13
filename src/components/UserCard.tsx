"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const UserCard = ({ jabatan, darkMode }: { jabatan: string; darkMode: boolean }) => {
  const [count, setCount] = useState(0);

  // Fungsi untuk mengambil data berdasarkan jabatan
  const fetchData = async () => {
    try {
      let response;
      if (jabatan === "guru") {
        // Fetch data khusus untuk guru
        response = await fetch("http://localhost:5000/guru");
      } else {
        // Fetch data untuk peserta berdasarkan jabatan
        response = await fetch(`http://localhost:5000/peserta?jabatan=${jabatan}`);
      }

      const data = await response.json();
      setCount(data.length); // Total data dengan jabatan tertentu
    } catch (error) {
      console.error(`Error fetching data for jabatan "${jabatan}":`, error);
    }
  };

  // Menjalankan fetch data saat komponen pertama kali di render
  useEffect(() => {
    fetchData();
  }, [jabatan]);

  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-[130px] 
        ${darkMode ? "bg-gray-800 text-white" : "odd:bg-lamaPurple even:bg-lamaYellow"}`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`text-[10px] px-2 py-1 rounded-full 
            ${darkMode ? "bg-gray-700 text-green-400" : "bg-white text-green-600"}`}
        >
          Total
        </span>
        <Image src="/more.png" alt="More icon" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium">
        {jabatan === "guru" ? "Guru & Tendik" : `Kelas ${jabatan}`}
      </h2>
    </div>
  );
};

export default UserCard;
