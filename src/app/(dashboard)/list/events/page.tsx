"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string; // Time with values like "Sore", "Pagi", etc.
  description: string;
};

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    accessor: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Description",
    accessor: "description",
    className: "hidden lg:table-cell",
  },
];

const EventListPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/kegiatan");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format tanggal menjadi dd/mm/yyyy
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const renderRow = (item: Event) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">{formatDate(item.date)}</td>
      <td className="hidden md:table-cell">
        <span
          className={`px-2 py-1 rounded text-white ${
            item.time === "Pagi"
              ? "bg-blue-500"
              : item.time === "Siang"
              ? "bg-yellow-500"
              : item.time === "Sore"
              ? "bg-orange-500"
              : "bg-gray-500"
          }`}
        >
          {item.time}
        </span>
      </td>
      <td className="hidden lg:table-cell">{item.description}</td>
    </tr>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalItems = events.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = events.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={currentData} />
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EventListPage;
