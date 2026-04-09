function MedicineTable({ medicines, selectedId, onSelectMedicine }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Medicine</th>
            <th className="px-4 py-3">Batch</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => {
            const totalQuantity = medicine.batches?.reduce((acc, b) => acc + b.quantity, 0) || 0;
            const earliestExpiry = medicine.batches?.reduce((prev, curr) => {
              return (new Date(curr.expiryDate) < new Date(prev.expiryDate)) ? curr : prev;
            })?.expiryDate || 'N/A';
            const batchNum = medicine.batches?.[0]?.batchNumber || 'N/A';

            const lowStock = totalQuantity <= 20
            const isSelected = medicine.id === selectedId
            return (
              <tr
                key={medicine.id}
                onClick={() => onSelectMedicine(medicine)}
                className={`cursor-pointer border-t border-slate-100 ${
                  isSelected ? 'bg-brand-50' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-700">{medicine.name}</td>
                <td className="px-4 py-3 text-slate-600">{batchNum}</td>
                <td className="px-4 py-3 text-slate-600">{medicine.category}</td>
                <td className="px-4 py-3 text-slate-600">{medicine.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      lowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {lowStock ? `Low (${totalQuantity})` : `In Stock (${totalQuantity})`}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{earliestExpiry}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!medicines.length && (
        <p className="px-4 py-6 text-center text-sm text-slate-500">No medicines match your search.</p>
      )}
    </div>
  )
}

export default MedicineTable
