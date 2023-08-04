import React, { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import { useDispatch } from 'react-redux'
import { setDateRange } from '../../../store/searchSlice'
import format from 'date-fns/format'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DatePicker = ({ onSelectDateRange }) => {
  const dispatch = useDispatch();
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ])

  const [open, setOpen] = useState(false)

  const handleSelectDateRange = (dateRange) => {
    dispatch(setDateRange({ startDate: dateRange.startDate.toISOString(), endDate: dateRange.endDate.toISOString() }));
    onSelectDateRange({ startDate: dateRange.startDate.toISOString(), endDate: dateRange.endDate.toISOString() });
  };

  // toggles target element 
  const refOne = useRef(null)

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)

    return () => {
      document.removeEventListener('keydown', hideOnEscape, true);
      document.removeEventListener('click', hideOnClickOutside, true);
    };
  }, [])

  const hideOnClickOutside = (e) => {
    if( refOne.current && !refOne.current.contains(e.target) ) {
      setOpen(false)
    }
  }

  const hideOnEscape = (e) => {
    if( e.key === "Escape" ) {
      setOpen(false)
    }
  }

  return (
    <div className="calendar">
    <div className="input-container">
      <input
        value={
          range[0].endDate
            ? `${format(range[0].startDate, 'MM/dd/yyyy')} ${
                range[0].startDate !== range[0].endDate ? ` to ${format(range[0].endDate, 'MM/dd/yyyy')}` : ''
              }`
            : `${format(range[0].startDate, 'MM/dd/yyyy')}`
        }
        readOnly
        className="inputBox"
        onClick={() => setOpen((open) => !open)}
      />
      <button
        className="clearButton"
        onClick={() => {
          setRange([
            {
              startDate: new Date(),
              endDate: null,
              key: 'selection',
            },
          ]);
          dispatch(setDateRange({ startDate: null, endDate: null }));
        }}
      >
        x
      </button>
    </div>
    <div ref={refOne}>
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

export default DatePicker