import Modal from "./Modal";

const ProfileModal = ({ user, showModal, setShowModal }) => {
  // console.log(user);
  const header = user?.avatar ? (
    <div className="flex items-center gap-4">
      <img
        src={user?.avatar}
        alt={user?.name || "View Profile"}
        className="w-8 h-8 rounded-full object-cover"
      />

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {user?.name || "View Profile"}
      </h3>
    </div>
  ) : (
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      {user?.name || "View Profile"}
    </h3>
  );

  const body = (
    <div className="p-6 space-y-6">
      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        <span className="font-bold">Email: </span>
        {user?.email}
      </p>
      <p>View profile of this user</p>
    </div>
  );

  const btn1 = (
    <button
      type="button"
      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
      onClick={() => setShowModal(!showModal)}
    >
      I accept
    </button>
  );

  const btn2 = (
    <button
      type="button"
      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
      onClick={() => setShowModal(!showModal)}
    >
      Decline
    </button>
  );

  return (
    <Modal
      show={showModal}
      setShow={setShowModal}
      header={header}
      body={body}
      btn1={btn1}
      btn2={btn2}
    />
  );
};

export default ProfileModal;
