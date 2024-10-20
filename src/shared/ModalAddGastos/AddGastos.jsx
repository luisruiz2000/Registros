import { useEffect, useState } from "react";
import "./addGastos.css";

const AddGastos = ({ onGastoAgregado }) => {
  const [gasto, setGasto] = useState('');

  useEffect(() => {
    // Inicializa el localStorage con 0 si no existe
    if (localStorage.getItem("gastos") === null) {
      localStorage.setItem("gastos", 0);
    }
  }, []);

  const handleSumarGastos = (e) => {
    e.preventDefault();
    const nuevoGasto = parseInt(gasto);

    // Verificar que el gasto sea un número válido
    if (!isNaN(nuevoGasto)) {
      // Obtener el total actual de gastos
      const totalGastos = parseInt(localStorage.getItem("gastos")) || 0;

      // Sumar el nuevo gasto al total
      const nuevoTotal = totalGastos + nuevoGasto;

      // Guardar el nuevo total en el localStorage
      localStorage.setItem("gastos", nuevoTotal);

      // Llama a la función de callback para actualizar el estado en Contabilidad
      onGastoAgregado(nuevoTotal);

      // Reiniciar el campo de entrada
      setGasto('');
      console.log("Total de gastos actualizados:", nuevoTotal);
    } else {
      console.log("Por favor, ingrese un monto válido.");
    }
  };

  return (
    <div
      className="modal fade"
      id="addGastosModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="addRegisterModalLabel"
      aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title" id="addRegisterModalLabel">
              Agregar Nuevo Gasto
            </h5>
            <i
              className="bi bi-x-circle-fill close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"></i>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSumarGastos}>
              <label>Gastos</label>
              <input
                type="number"
                className="form-control mt-3"
                placeholder="Ingrese el monto"
                value={gasto} // Enlaza el valor del estado al input
                onChange={(e) => setGasto(e.target.value)} // Actualiza el estado
              />
              <button type="submit" className="btn btnAddRegister mt-4">
                Agregar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGastos;
