  interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }

  export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
    return (
      <input
        type="text"
        value={searchQuery}
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent outline-none border-none text-primary placeholder-muted-dark"
      />
    );
  }


// function SearchBar({
//   filterText,
//   inStockOnly,
//   onFilterTextChange,
//   onInStockOnlyChange
// }) {
//   return (
//     <form>
//       <input
//         type="text"
//         value={filterText} placeholder="Search..."
//         onChange={(e) => onFilterTextChange(e.target.value)} />
//       <label>
//         <input
//           type="checkbox"
//           checked={inStockOnly}
//           onChange={(e) => onInStockOnlyChange(e.target.checked)} />
//         {' '}
//         Only show products in stock
//       </label>
//     </form>
//   );
// }