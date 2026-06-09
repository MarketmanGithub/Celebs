import type { Celeb } from "../models/celeb";
import { deleteCeleb } from "../api/celebApi";
import { toast } from "react-hot-toast";

type Props = {
  celeb: Celeb;
  onDelete?: () => void;
  viewMode?: "grid" | "list";
};

export default function CelebCard({
  celeb,
  onDelete,
  viewMode = "grid",
}: Props) {
  const handleDelete = async () => {
    try {
      await deleteCeleb(celeb.id);
      toast.success(`${celeb.name} deleted.`);
      if (onDelete) onDelete();
    } catch {
      toast.error("Failed to delete celeb.");
    }
  };

  return (
    <div
      className={
        viewMode === "grid"
          ? "relative bg-white rounded-2xl shadow-md p-4 w-full max-w-sm"
          : "relative bg-white rounded-xl shadow p-2 w-full max-w-xs flex items-center"
      }
      style={viewMode === "list" ? { minWidth: 320, minHeight: 128 } : {}}
    >
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
        aria-label="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {viewMode === "grid" ? (
        <img
          src={celeb.image}
          alt={celeb.name}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      ) : (
        <img
          src={celeb.image}
          alt={celeb.name}
          className="w-1/2 h-32 object-cover rounded mr-4"
          style={{ minWidth: 96, maxWidth: 128 }}
        />
      )}
      <div className={viewMode === "grid" ? "" : "flex-1"}>
        <h2
          className={
            viewMode === "grid"
              ? "text-xl font-bold"
              : "text-base font-semibold"
          }
        >
          {celeb.name}
        </h2>
        <p className="text-gray-600 text-sm">
          Role: {celeb.roles?.join(", ") || "N/A"}
        </p>
        <p className="text-gray-500 text-sm">Gender: {celeb.gender}</p>
        <p className="text-gray-500 text-sm">
          Born: {celeb.birthDate || "Unknown"}
        </p>
      </div>
    </div>
  );
}
