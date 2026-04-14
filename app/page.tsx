import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: inventario } = await supabase
    .from('Inventario')
    .select('*')

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">📦 Gestión de Inventario</h1>
        <p className="text-blue-200 mt-1">Incubadora - Aula Informática</p>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-500 text-sm">Total Artículos</p>
            <p className="text-4xl font-bold text-blue-800">{inventario?.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">En Stock</p>
            <p className="text-4xl font-bold text-green-600">
              {inventario?.filter(i => i.cantidad > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Sin Stock</p>
            <p className="text-4xl font-bold text-red-600">
              {inventario?.filter(i => i.cantidad === 0).length}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-700 text-white p-4">
            <h2 className="text-xl font-bold">Listado de Inventario</h2>
          </div>
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left text-blue-800 font-semibold">Nº Artículo</th>
                <th className="p-3 text-left text-blue-800 font-semibold">Hardware</th>
                <th className="p-3 text-left text-blue-800 font-semibold">Fabricante</th>
                <th className="p-3 text-left text-blue-800 font-semibold">Descripción</th>
                <th className="p-3 text-left text-blue-800 font-semibold">Ubicación</th>
                <th className="p-3 text-left text-blue-800 font-semibold">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {inventario?.map((item, index) => (
                <tr key={item.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-mono text-blue-700">{item.numero_articulo}</td>
                  <td className="p-3">{item.hardware}</td>
                  <td className="p-3">{item.fabricante}</td>
                  <td className="p-3">{item.descripcion}</td>
                  <td className="p-3">{item.ubicacion}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                      item.cantidad > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.cantidad}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}