import { useEffect } from "react";
import useKiosko from "../hooks/useKiosko";

const Asistencia = () => {

    const {handleChangeModalAsistencia, mesa, setMesa, colocarAsistencia, value, setValue, getItems} = useKiosko();

    const comprobarAsistencia = () => {
        return mesa === '';
    }

    useEffect(() => {
        window.addEventListener('storage', () => {
            getItems();
        });
    }, []);


  return (
    <>
        <div className="flex justify-end mb-5">

            <p className="block uppercase text-slate-800 font-bold text-xl mr-7">
                Ingrese su Número de mesa
            </p>

            <button
                onClick={handleChangeModalAsistencia}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <form
            onSubmit={colocarAsistencia}
            >
                <div>
                    <input 
                        id="mesa"
                        type="text"
                        className="bg-gray-200 w-full mt-3 p-2 rounded-md"
                        value={mesa}
                        onChange={e => setMesa(e.target.value)}
                    />
                </div>

                <div className="mt-5">
                    <input 
                        type="submit"
                        className={`${comprobarAsistencia() ? "bg-indigo-200" : "bg-indigo-600 hover:bg-indigo-800"} w-full px-5 py-2 rounded uppercase font-bold text-white text-center"`}
                        value="Confirmar Asistencia"
                        disabled={comprobarAsistencia()}
                    />
                </div>
        </form>
    </>
  )
}

export default Asistencia