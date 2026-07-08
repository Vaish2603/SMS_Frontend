import React, { useState } from 'react';

export default function DataTable({ title, columns, data, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">Manage, slice, and mutate records parameters</p>
        </div>
        <button onClick={onAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow transition-colors">
          Add Record +
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Global system parameters query search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
              {columns.map(col => <th key={col} className="p-4 font-semibold">{col}</th>)}
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {currentItems.length > 0 ? currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                {Object.keys(item).filter(k => k !== 'id').map(key => (
                  <td key={key} className="p-4">{item[key]}</td>
                ))}
                <td className="p-4 text-right">
                  <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-xs">
                    Purge
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">
                  No matching database logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-xs border rounded bg-white hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-xs border rounded bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}