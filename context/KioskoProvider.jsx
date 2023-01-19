import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const KioskoContext = createContext();

const KioskoProvider = ({children}) => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});
    const [producto, setProducto] = useState({});
    const [modal, setModal] = useState(false);
    const [modalAsistencia, setModalAsistencia] = useState(false);
    const [pedido, setPedido] = useState([]);
    const [nombre, setNombre] = useState('');
    const [mesa, setMesa] = useState('');
    const [total, setTotal] = useState(0);
    const [value, setValue] = useState([]);

    const router = useRouter();
    
    const obtenerCategorias = async () => {
        const { data } = await axios('/api/categorias');
        setCategorias(data);
    }
    useEffect(() => {
        obtenerCategorias();
    }, []);
    
    useEffect(() => {
        setCategoriaActual(categorias[0])
    }, [categorias]);

    useEffect(() => {
        const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad) + total, 0);
        setTotal(nuevoTotal);
    }, [pedido]);

    useEffect(() => {
        if(value?.length) {
            localStorage.setItem("asistencia", JSON.stringify(value));
        }
    }, [value]);
    

    const handleClickCategoria = id => {
        const categoria = categorias.filter(cat => cat.id === id);
        setCategoriaActual(categoria[0]);
        router.push('/');
    }

    const handleSetProducto = producto => {
        setProducto(producto)
    }

    const handleChangeModal = () => {
        setModal(!modal);
    }
    
    const handleChangeModalAsistencia = () => {
        setModalAsistencia(!modalAsistencia);
    }

    const handleAgregarPedido = ({categoriaId, ...producto}) => {

        if(pedido.some(productoState => productoState.id === producto.id)){
            //Actualizar la cantidad

            const pedidoActualizado = pedido.map(productoState => productoState.id === producto.id ?
            producto : productoState)
            setPedido(pedidoActualizado);

            toast.success('Guardado correctamente');
        }else{
            setPedido([...pedido, producto])
            toast.success('Agregado al Pedido');
        }

        setModal(false);

    }

    const handleEditarCantidades = (id) => {
        const productoActualizar = pedido.filter(producto => producto.id === id);
        setProducto(productoActualizar[0]);
        setModal(true);
    }

    const handleEliminarProducto = id => {
        const pedidoActualizado = pedido.filter(producto => producto.id !== id);
        setPedido(pedidoActualizado);
    }

    const colocarOrden = async(e) => {
        e.preventDefault();
        
        try {
            await axios.post('/api/ordenes', {pedido, nombre, total, fecha: Date.now().toString()});

            //restear la app
            setCategoriaActual(categorias[0]);
            setPedido([]);
            setNombre('');
            setTotal(0);

            toast.success('Pedido realizado correctamente');

            setTimeout(() => {
                router.push('/');
            }, 3000)

        } catch (error) {
            console.log(error);
        }

        // console.log(pedido);
        // console.log(nombre);
        // console.log(total);
    }

    const colocarAsistencia = (e) => {
        e.preventDefault();
        setModalAsistencia(!modalAsistencia);
        setMesa('');
        toast.success('Estamos con usted en un momento');        
        
        setValue(value => [...value, mesa]);
        
    } 

    function getItems(){
        const items = JSON.parse(localStorage.getItem('asistencia'));

        if(items){
            setValue(items);
        }
    }

    const removeLocal = (newAsistencia) => {
        const items = JSON.parse(localStorage.getItem('asistencia'));
        const deleteItem = items.filter(el => el !== newAsistencia );
        localStorage.setItem("asistencia", JSON.stringify(deleteItem));

        const newValue = value.filter(valueAdmin => valueAdmin !== newAsistencia);
        setValue(newValue);;
    }


   
    return(
        <KioskoContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                producto,
                handleSetProducto,
                modal, 
                handleChangeModal,
                handleAgregarPedido,
                pedido,
                handleEditarCantidades,
                handleEliminarProducto,
                nombre, 
                setNombre,
                colocarOrden,
                total,
                mesa, 
                setMesa,
                modalAsistencia,
                handleChangeModalAsistencia,
                colocarAsistencia,
                getItems,
                value,
                setValue,
                removeLocal,
            }}
        >
            {children}
        </KioskoContext.Provider>
    )
}

export {
    KioskoProvider
}
export default KioskoContext;