import { useEffect } from "react";

interface ModalProps {
  errorMessage: string | null;
  onClose: () => void;
}

export default function Modal({ errorMessage, onClose }: ModalProps) {
  useEffect(() => {
    if (errorMessage) {
      (document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal();
    }
  }, [errorMessage]);

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle ">
      <div className="modal-box bg-gray-300 rounded-2xl">
        <h3 className="font-bold text-2xl">Error</h3>
        <p className="py-4">
          <h4 className="text-[20px]">Sorry!</h4>
          <h4> your error: {errorMessage || "We will fix it!"}</h4>
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn border-none bg-transparent"
              onClick={onClose}
            >
              close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
