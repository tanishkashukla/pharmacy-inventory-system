function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search medicines by name or category..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}

export default SearchBar
