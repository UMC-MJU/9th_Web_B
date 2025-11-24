export default function CommentSkeleton() {
  return (
    <div className="animate-pulse border-b border-gray-700 py-3 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-1/4" />
      <div className="h-3 bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-700 rounded w-2/4" />
    </div>
  );
}
