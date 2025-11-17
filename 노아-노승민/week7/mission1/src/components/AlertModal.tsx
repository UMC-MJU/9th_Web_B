interface AlertModalProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void; 
}

export default function AlertModal({ message, onConfirm, onCancel }: AlertModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-6 text-center w-[340px]">
        <h2 className="text-lg font-semibold mb-4 text-white">알림</h2>

        <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          {/* 취소 버튼 */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition w-24"
            >
              취소
            </button>
          )}

          {/* 확인 버튼 */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition w-24"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
