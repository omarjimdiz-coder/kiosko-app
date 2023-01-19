import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr';
import axios from 'axios';
import AdminLayout from "../layout/AdminLayout";
import Orden from '../components/Orden';
import Asistencias from '../components/Asistencias';
import useKiosko from '../hooks/useKiosko';

export default function Admin(){

    const { getItems, value } = useKiosko();
    
    const fetcher = () => axios('/api/ordenes').then(datos => datos.data);
    const { data, error, isLoading } = useSWR('/api/ordenes', fetcher, {refreshInterval: 100});

    useEffect(() => {
        window.addEventListener('storage', () => {
            getItems();
        });

        return () => {
            window.removeEventListener('storage', getItems())
        }
    }, []);
    
    return (
        <AdminLayout pagina={'Admin'}>
            <h1 className="text-4xl font-black">Panel de Administración</h1>
            <p className="text-2xl my-10">Administra las Asistencias y Ordenes</p>

            <h3 className='text-2xl font-bold text-amber-500 mb-3'>Asistencias</h3>

            {
                value && value.length ? value.map(asistencia => (
                    <Asistencias 
                        key={uuidv4()} 
                        asistencia={asistencia}    
                    />))
                    : <p>No hay asistencias pendientes</p>
            }

            <h3 className='text-2xl font-bold text-amber-500 mb-3'>Ordenes</h3>

            { data && data.length ? data.map(orden => (
                <Orden 
                    key={orden.id}
                    orden={orden}
                />
            )) : <p>No hay ordenes pendientes</p>}
        </AdminLayout>
    )
}