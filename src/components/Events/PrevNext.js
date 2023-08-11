import React from "react";

const PrevNext = ({ currentPage, totalPages, onPageClick, onNextClick, onPreviousClick }) => {
  const renderPageButtons = () => {
    const pageButtons = [];

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      pageButtons.push(
        <button
          key={pageNumber}
          onClick={() => onPageClick(pageNumber)}
          className={currentPage === pageNumber ? "active" : ""}
        >
          {pageNumber}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="pagination-buttons">
      <button onClick={onPreviousClick} disabled={currentPage === 1}>
        Previous
      </button>
      {renderPageButtons()}
      <button onClick={onNextClick} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default PrevNext;

