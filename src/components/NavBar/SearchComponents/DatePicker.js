import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { useDispatch } from "react-redux";
import {
  Nav,
  Row,
  Container,
  Button,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { setDateRange } from "../../../store/searchSlice";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../style/index.css";

const DatePicker = ({ onSelectDateRange }) => {
  const dispatch = useDispatch();
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);

  const handleSelectDateRange = (dateRange) => {
    dispatch(
      setDateRange({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      })
    );
    onSelectDateRange({
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });
  };

  // toggles target element
  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);

    return () => {
      document.removeEventListener("keydown", hideOnEscape, true);
      document.removeEventListener("click", hideOnClickOutside, true);
    };
  }, []);

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`datepicker-container`}>
      <InputGroup
        className="input-container"
        style={{
          marginTop: ".5rem",
          marginBottom: "1.5rem",
        }}
      >
        <Form.Control
          style={{ width: "225px" }}
          className="calendarInput"
          value={
            range[0].endDate
              ? `${format(range[0].startDate, "MM/dd/yyyy")} ${
                  range[0].startDate !== range[0].endDate
                    ? ` to ${format(range[0].endDate, "MM/dd/yyyy")}`
                    : ""
                }`
              : `${format(range[0].startDate, "MM/dd/yyyy")}`
          }
          readOnly
          onClick={() => setOpen((open) => !open)}
        />
        <Button
          variant="outline-light"
          className="clearButton"
          style={{ opacity: "80%" }}
          onClick={() => {
            setRange([
              {
                startDate: new Date(),
                endDate: null,
                key: "selection",
              },
            ]);
            dispatch(setDateRange({ startDate: null, endDate: null }));
          }}
        >
          Clear Date Selection
        </Button>
      </InputGroup>
      <div className="datepicker-popup">
        {open && (
          <DateRange
            onChange={(item) => {
              setRange([item.selection]);
              handleSelectDateRange(item.selection);
            }}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
        )}
      </div>
    </div>
  );
};

export default DatePicker;
