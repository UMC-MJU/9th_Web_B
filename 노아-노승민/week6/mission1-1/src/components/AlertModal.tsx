interface AlertModalProps {
  message: string;
  onConfirm: () => void;
}

export default function AlertModal({ message, onConfirm }: AlertModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 text-center w-[320px]">
        <h2 className="text-lg font-semibold mb-3 text-white">알림</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
