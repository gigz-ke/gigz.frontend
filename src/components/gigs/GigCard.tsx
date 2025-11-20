import type { Gig } from "../../data/models/Gig";

interface GigCardProps {
  gig: Gig;
  categoryName?: string; 
  onClick?: (gigId: string) => void;
}

const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image";

export default function GigCard({ gig, categoryName, onClick }: GigCardProps) {
  return (
    <div
      className="group w-full max-w-sm bg-white rounded-xl border border-gray-200 hover:shadow-lg transition overflow-hidden cursor-pointer"
      onClick={() => onClick?.(gig._id)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-16/10 w-full bg-gray-100 overflow-hidden">
        <img
          src={gig.coverImage || fallbackImage}
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => ((e.target as HTMLImageElement).src = fallbackImage)}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{gig.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{gig.shortDescription}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-md capitalize">
            {categoryName || "Unknown"}
          </span>

          <span className="text-sm font-semibold text-gray-900">
            ${gig.price}
          </span>
        </div>
      </div>
    </div>
  );
}
