import "../../styles/filterbar.css";
import { FaSearch } from "react-icons/fa";
function FilterBar({ categories, onFilter, onSearch, onSort }) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <select onChange={(e) => onFilter(e.target.value)} defaultValue="All">
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select onChange={(e) => onSort(e.target.value)} defaultValue="default">
        <option value="default">Sort By</option>

        <option value="name">Product Name (A-Z)</option>

        <option value="price-low">Price: Low → High</option>

        <option value="price-high">Price: High → Low</option>

        <option value="rating-low">Rating: Low → High</option>

        <option value="rating-high">Rating: High → Low</option>
      </select>

      <button
        className="reset-btn"
        onClick={() => {
          onFilter("All");
          onSearch("");
          onSort("default");
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterBar;
