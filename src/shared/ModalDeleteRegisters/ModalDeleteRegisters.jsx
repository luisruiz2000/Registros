import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./modalAddRegister.css";

const resetState = {
  asesora: "",
  servicio: "",
  adicional: "",
  metodoPago: "",
  pago: "",
};
const ModalAddRegister = ({ onClose, refreshData }) => {
  const [registers, setRegisters] = useState([]);

  const [newRegister, setNewRegister] = useState(resetState);

  useEffect(() => {
    const getRegisterStorage =
      JSON.parse(localStorage.getItem("register")) || [];
    setRegisters(getRegisterStorage);
  }, [newRegister]);

  const [validate, setValidate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validForm()) {
      setValidate(true);
      return;
    }

    const updatedRegisters = [...registers, newRegister];

    localStorage.setItem("register", JSON.stringify(updatedRegisters));
    refreshData();
    setRegisters(updatedRegisters);
    setNewRegister(resetState);
    setValidate(false);
    onClose();
  };

  const validForm = () => {
    const { asesora, servicio, metodoPago, pago } = newRegister;
    return asesora && servicio && metodoPago && pago;
  };

  return (
    <div
      className="modal fade"
      id="addRegisterModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="addRegisterModalLabel"
      aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title" id="addRegisterModalLabel">
              Agregar Nuevo Registro
            </h5>
            <i
              className="bi bi-x-circle-fill close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}></i>
          </div>
          <div className="modal-body">
            <form className="formRegister" onSubmit={handleSubmit}>
              {/* Seleccionar asesora */}
              <select
                className="form-select"
                value={newRegister.asesora}
                onChange={(e) =>
                  setNewRegister((prev) => ({
                    ...prev,
                    asesora: e.target.value,
                  }))
                }>
                <option value="">Seleccionar Asesora</option>
                <option value="Valentina">Valentina</option>
                <option value="Alejandra">Alejandra</option>
                <option value="Yelimar">Yelimar</option>
                <option value="Saira">Saira</option>
                <option value="Asesora temporal 1">Asesora temporal 1</option>
                <option value="Asesora temporal 2">Asesora temporal 2</option>
              </select>

              {/* Seleccionar Servicio */}
              <select
                value={newRegister.servicio}
                className="form-select mt-3"
                onChange={(e) =>
                  setNewRegister((prev) => ({
                    ...prev,
                    servicio: e.target.value,
                  }))
                }>
                <option value="">Seleccionar Servicio</option>
                <option value="Promocion">Promocion</option>
                <option value="Completo">Completo</option>
                <option value="Organica">Organica</option>
              </select>

              {/* Servicios Adicionales */}
              <input
                type="text"
                className="form-control mt-3"
                placeholder="Adicionales"
                value={newRegister.adicional}
                onChange={(e) =>
                  setNewRegister((prev) => ({
                    ...prev,
                    adicional: e.target.value,
                  }))
                }
              />

              {/* Pago */}
              <input
                type="number"
                className="form-control mt-3"
                placeholder="Pago"
                value={newRegister.pago}
                onChange={(e) =>
                  setNewRegister((prev) => ({ ...prev, pago: e.target.value }))
                }
              />

              {/* Método de Pago */}
              <select
                className="form-select mt-3"
                value={newRegister.metodoPago}
                onChange={(e) =>
                  setNewRegister((prev) => ({
                    ...prev,
                    metodoPago: e.target.value,
                  }))
                }>
                <option value="">Seleccionar Método de Pago</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </select>

              <button type="submit" className="btn btnAddRegister">
                Agregar
              </button>

              {validate && (
                <span className="text-center text-danger">
                  Llena los campos requeridos
                </span>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Validación de props
ModalAddRegister.propTypes = {
  onClose: PropTypes.func.is,
};

export default ModalAddRegister;
