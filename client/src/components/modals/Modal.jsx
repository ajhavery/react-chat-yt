import { useRef, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";

const Modal = ({
  show,
  setShow,
  header,
  body,
  btn1,
  btn2,
  isForm,
  handleSubmit,
}) => {
  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [modalRef, setShow]);

  return (
    // grey overlay over the entire screen
    <div
      aria-hidden="true"
      tabIndex="-1"
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full bg-gray-600 bg-opacity-70 ${
        show ? "" : "hidden"
      }`}
    >
      {/* modal section */}
      <div
        className="relative p-4 w-full max-w-2xl h-full md:h-auto mx-auto mt-10"
        ref={modalRef}
      >
        {/* modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* modal header */}
          <div className="flex justify-between items-center p-4 rounded-t border-b border-gray-400 dark:border-gray-600">
            {header}
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setShow(!show)}
            >
              <MdOutlineCancel className="w-8 h-8" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* modal body */}
          {isForm ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 px-6 py-4">
                {body}
                {/* modal footer with buttons */}
                <div className="flex items-center space-x-4 rounded-b border-gray-200 dark:border-gray-600">
                  {btn1}
                  {btn2}
                </div>
              </div>
            </form>
          ) : (
            <div>
              {body}
              {/* modal footer with buttons */}
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                {btn1}
                {btn2}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
