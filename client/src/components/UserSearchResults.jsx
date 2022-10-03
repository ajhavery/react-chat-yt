import React from "react";

const UserSearchResults = ({ loading, searchResults, handleClick }) => {
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {searchResults &&
            searchResults?.map((result) => (
              <li
                key={result._id}
                className="px-2 py-1 bg-white border rounded-full flex items-center gap-4 cursor-pointer hover:bg-blue-100"
                onClick={() => handleClick(result)}
              >
                <div>
                  <img
                    src={result?.avatar}
                    alt={result?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">{result?.name}</p>
                  <p>{result?.email}</p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchResults;
