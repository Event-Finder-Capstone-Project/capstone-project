import React, { useState } from "react";


const SearchBar = () => {
    const [q, setQ] = useState(""); 
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const userInput = formData.get("searchInput");
      setQ(userInput);
    };

    return (
        <>
          <form onSubmit={handleSubmit}> 
            <input
              type="text"
              name="searchInput"
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search events"
            />
            <button type="submit">Submit</button> 
          </form>
        </>
      );
    };

export default SearchBar;