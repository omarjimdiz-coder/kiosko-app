import useKiosko from "../hooks/useKiosko";

const Asistencias = ({asistencia: newAsistencia}) => {

  const { removeLocal } = useKiosko();
  
  return (
    <div className="flex justify-between items-center border p-5">    
        <h3 className="text-2md">Se requiere atención en la mesa no: {''}
          <span className="font-bold text-amber-500">{newAsistencia}</span> 
        </h3>

        <button
          onClick={() => removeLocal(newAsistencia)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
  )
}

export default Asistencias