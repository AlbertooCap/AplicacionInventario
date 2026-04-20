'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Inventario({ inventarioInicial }) {
  const [inventario, setInventario] = useState(inventarioInicial)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [confirmarBaja, setConfirmarBaja] = useState(null)
  const [form, setForm] = useState({
    numero_articulo: '', hardware: '', fabricante: '',
    descripcion: '', ubicacion: '', cantidad: ''
  })

  const router = useRouter()

  useEffect(() => {
        const canal = supabase
        .channel('inventario-realtime')
        .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventario' },
        (payload) => {
            if (payload.eventType === 'INSERT') {
            setInventario(prev => [...prev, payload.new])
            }
            if (payload.eventType === 'DELETE') {
            setInventario(prev => prev.filter(item => item.id !== payload.old.id))
            }
        }
        )
        .subscribe()

            return () => supabase.removeChannel(canal)
    }, [])

  const handleAlta = async () => {
    const { data, error } = await supabase
      .from('Inventario')
      .insert([form])
      .select()
    if (!error) {
      setInventario([...inventario, data[0]])
      setForm({ numero_articulo: '', hardware: '', fabricante: '',
        descripcion: '', ubicacion: '', cantidad: '' })
      setMostrarFormulario(false)
      router.refresh()
    }
  }

  const handleBaja = async (id) => {
    const { error } = await supabase
      .from('Inventario')
      .delete()
      .eq('id', id)
    if (!error) {
      setInventario(inventario.filter(item => item.id !== id))
      setConfirmarBaja(null)
      router.refresh()
    }
  }

  const campos = [
    { key: 'numero_articulo', label: 'Nº Artículo', placeholder: 'AF-TCL-01' },
    { key: 'hardware', label: 'Hardware', placeholder: 'TECLADO' },
    { key: 'fabricante', label: 'Fabricante', placeholder: 'LOGITECH' },
    { key: 'descripcion', label: 'Descripción', placeholder: 'K120' },
    { key: 'ubicacion', label: 'Ubicación', placeholder: 'AULA INFORMATICA' },
    { key: 'cantidad', label: 'Cantidad', placeholder: '1' },
  ]

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        <p className="text-blue-200 mt-1">Cámara del Comercio Linares 2026</p>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-500 text-sm">Total Artículos</p>
            <p className="text-4xl font-bold text-blue-800">{inventario.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">En Stock</p>
            <p className="text-4xl font-bold text-green-600">
              {inventario.filter(i => i.cantidad > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Sin Stock</p>
            <p className="text-4xl font-bold text-red-600">
              {inventario.filter(i => i.cantidad === 0).length}
            </p>
          </div>
        </div>

        {/* Botón añadir */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow">
            {mostrarFormulario ? '✕ Cancelar' : '＋ Añadir Artículo'}
          </button>
        </div>

        {/* Formulario alta */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border-t-4 border-blue-600">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Nuevo Artículo</h2>
            <div className="grid grid-cols-2 gap-4">
              {campos.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAlta}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg w-full">
              ✓ Guardar Artículo
            </button>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-700 text-white p-4">
            <h2 className="text-xl font-bold">Listado de Inventario</h2>
          </div>
          <table className="w-full md:table-fixed border-collapse">
            <thead className="bg-blue-50">
                <tr>
                  <th className="p-3 text-left text-blue-800 font-semibold w-36">Nº Artículo</th>
                  <th className="p-3 text-left text-blue-800 font-semibold w-28">Hardware</th>
                  <th className="p-3 text-left text-blue-800 font-semibold w-64">Ubicación</th>
                  <th className="p-3 text-left text-blue-800 font-semibold w-24">Acciones</th>
                </tr>
          </thead>
            <tbody>
              {inventario.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-mono text-blue-700">{item.numero_articulo}</td>
                      <td className="p-3">{item.hardware}</td>
                      <td className="p-3">{item.ubicacion}</td>
                      <td className="p-3">
                            {confirmarBaja === item.id ? (
                              <div className="flex flex-col gap-1">
                                <button onClick={() => handleBaja(item.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-lg font-bold">
                                  ✓
                                </button>
                                <button onClick={() => setConfirmarBaja(null)}
                                  className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-2 py-1 rounded-lg">
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmarBaja(item.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2 py-1 rounded-lg font-bold">
                                Baja
                              </button>
                            )}
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