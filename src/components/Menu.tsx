'use client';

import { useState, useEffect } from "react";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/sign-out",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-out"); // Redirect ke halaman sign-out
  };

  // Tambahkan atau hapus kelas pada body untuk mencegah scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return item.label === "Logout" ? (
                <button
                  key={item.label}
                  onClick={() => setIsModalOpen(true)} // Buka modal saat logout diklik
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}

      {/* Modal Logout */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)} // Tutup modal saat klik di luar
        >
          <div
            className="p-6 rounded-md space-y-4 bg-white text-gray-800 relative"
            onClick={(e) => e.stopPropagation()} // Hentikan propagasi klik
          >
            <h2 className="text-lg font-bold">Konfirmasi Logout</h2>
            <p>Apakah Anda yakin ingin keluar?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleLogout(); // Arahkan ke halaman sign-out
                  setIsModalOpen(false); // Tutup modal
                }}
                className="btn btn-primary"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
