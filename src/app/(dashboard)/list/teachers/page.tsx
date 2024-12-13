"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useEffect, useState } from "react";

type Participant = {
  id: string;
  name: string;
  jabatan: string;
  status: string;
  date: string;
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Jabatan", accessor: "jabatan", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden lg:table-cell" },
];

const ParticipantListPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch("http://localhost:5000/guru");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Participant[] = await response.json();
        setParticipants(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const renderRow = (item: Participant) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.jabatan}</td>
      <td className="hidden md:table-cell">
        <span
          className={`px-2 py-1 rounded text-white ${
            item.status === "Aktif" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="hidden md:table-cell">{formatDate(item.date)}</td>
    </tr>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Pagination logic
  const totalItems = participants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = participants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Participants</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentData} />
      {/* PAGINATION */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ParticipantListPage;
