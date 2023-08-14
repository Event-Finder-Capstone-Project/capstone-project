import React from "react";
import { Nav, Row, Col, Container, Button } from "react-bootstrap";
import "../style/index.css";

const PrevNext = ({
  currentPage,
  totalPages,
  totalEvents,
  onPageClick,
  onNextClick,
  onPreviousClick,
}) => {
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
        <Button
          key={pageNumber}
          value={pageNumber}
          variant="outline"
          style={{
            color: "white",
            border: "none",
            fontSize: "24px",
          }}
          onClick={() => onPageClick(pageNumber)}
          className={currentPage === pageNumber ? "active" : ""}
        >
          {currentPage === pageNumber ? (
            <strong>{pageNumber}</strong>
          ) : (
            pageNumber
          )}
        </Button>
      );
    }
    return pageButtons;
  };

  const startResult = (currentPage - 1) * 8 + 1;
  const endResult = Math.min(currentPage * 8, totalEvents);

  return (
    <div className="pagination-container" style={{ marginBottom: "5rem" }}>
      {totalEvents > 0 ? (
        <>
          <p className="pagination-info" style={{ fontSize: "18px" }}>
            Viewing results {startResult}-{endResult} of {totalEvents}
          </p>
          <div className="pagination-buttons">
            <Button
              onClick={onPreviousClick}
              disabled={currentPage === 1}
              variant="outline-light"
              style={{
                fontSize: "24px",
              }}
            >
              Previous
            </Button>
            {renderPageButtons()}
            <Button
              onClick={onNextClick}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline-light"
              style={{
                fontSize: "24px",
              }}
            >
              Next
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PrevNext;
