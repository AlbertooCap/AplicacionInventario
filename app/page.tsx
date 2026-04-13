import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: inventario, error } = await supabase
    .from('Inventario')
    .select('*')

  if (error) return <p>Error al cargar el inventario</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inventario Incubadora</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nº Artículo</th>
            <th className="border p-2">Hardware</th>
            <th className="border p-2">Fabricante</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Ubicación</th>
            <th className="border p-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.numero_articulo}</td>
              <td className="border p-2">{item.hardware}</td>
              <td className="border p-2">{item.fabricante}</td>
              <td className="border p-2">{item.descripcion}</td>
              <td className="border p-2">{item.ubicacion}</td>
              <td className="border p-2">{item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}