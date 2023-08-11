import React from "react";

const PrevNext = ({ currentPage, totalPages, totalEvents, onPageClick, onNextClick, onPreviousClick }) => {
  const renderPageButtons = () => {
    const pageButtons = [];
    const visiblePages = 5;

    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(visiblePages, totalPages);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - visiblePages + 1);
    }

    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
      pageButtons.push(
        <button
          key={pageNumber}
          onClick={() => onPageClick(pageNumber)}
          className={currentPage === pageNumber ? "active" : ""}
        >
           {currentPage === pageNumber ? (
          <strong>{pageNumber}</strong>
        ) : (
          pageNumber
        )}
        </button>
      );
    }
    return pageButtons;
  };

  const startResult = (currentPage - 1) * 8 + 1;
  const endResult = Math.min(currentPage * 8, totalEvents);

  return (
    <div className="pagination-container">
      {totalEvents > 0 ? (
        <>
          <p className="pagination-info">
            Viewing results {startResult}-{endResult} of {totalEvents}
          </p>
          <div className="pagination-buttons">
            <button onClick={onPreviousClick} disabled={currentPage === 1}>
              Previous
            </button>
            {renderPageButtons()}
            <button onClick={onNextClick} disabled={currentPage === totalPages || totalPages === 0}>
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
      }

export default PrevNext;
