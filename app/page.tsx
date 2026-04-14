import { supabase } from '@/lib/supabase'
import Inventario from './components/Inventario'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: inventario } = await supabase
    .from('Inventario')
    .select('*')

  return <Inventario inventarioInicial={inventario || []} />
}