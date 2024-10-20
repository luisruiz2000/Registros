import { useEffect, useState } from "react";
import ModalAddRegister from "../../shared/ModalAddRegister/ModalAddRegister";
import "./home.css";
import FechaHora from "../../shared/FechaHora/FechaHora";
import ExportExcel from "../../shared/ExportExcel/ExportExcel.jsx";
import { PORCENTAJES } from "../../Constants/constants.js";

const Home = () => {
  const [registers, setRegisters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState([]);
  const [filtersSelect, setFiltersSelect] = useState({
    Asesora: "",
    Servicio: "",
    MetodoPago: "",
  });


  const { ORGANICA_PORC, PROMOCION_PORC, COMPLETO_PORC, CORTE_PORC,  HIDRATACION_PORC } = PORCENTAJES;


  const clearFilters = () => {
    setFiltersSelect({ Asesora: "", Servicio: "", MetodoPago: "" });
    setSelectedItems([]);
  };

  useEffect(() => {
    const getRegisterStorage =
      JSON.parse(localStorage.getItem("register")) || [];
    setRegisters(getRegisterStorage);
  }, []);

  const openModal = () => {
    const modal = new window.bootstrap.Modal(
      document.getElementById("addRegisterModal")
    );
    modal.show();
  };

  const handleRefresh = () => {
    console.log("Nuevo Registro");
    clearFilters();
    const updatedRegisters = JSON.parse(localStorage.getItem("register")) || [];

    const total = updatedRegisters.reduce(
      (acc, curr) => acc + parseInt(curr.pago, 10),
      0
    );
    setTotal(total);
    setRegisters(updatedRegisters); // Actualizar registros
  };

  const onChangeSelect = (e, filtroName) => {
    const { value } = e.target;
    setFiltersSelect((prev) => ({
      ...prev,
      [filtroName]: value,
    }));
  };

  const formatCurrency = (amount) => {
    // Asegurarse de que el valor es un número
    if (isNaN(amount)) return amount;

    // Convertir a número y formatear
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const getAllRegisters = () =>
      JSON.parse(localStorage.getItem("register")) || [];

    const filteredRegisters = getAllRegisters().filter((register) => {
      return (
        (!filtersSelect.Asesora ||
          register.asesora === filtersSelect.Asesora) &&
        (!filtersSelect.Servicio ||
          register.servicio === filtersSelect.Servicio) &&
        (!filtersSelect.MetodoPago ||
          register.metodoPago === filtersSelect.MetodoPago)
      );
    });

    // Total de pagos
    const total = filteredRegisters.reduce(
      (acc, curr) => acc + parseInt(curr.pago, 10),
      0
    );
    setTotal(total);

    setRegisters(filteredRegisters);
  }, [filtersSelect]);

  const handleCheckboxChange = (index) => {
    const newSelectedItems = [...selectedItems];

    if (newSelectedItems.includes(index)) {
      newSelectedItems.splice(newSelectedItems.indexOf(index), 1); // Desmarcar check
    } else {
      newSelectedItems.push(index); // Marcar check
    }

    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Seleccionar todos los elementos visibles después del filtro
      setSelectedItems(registers.map((_, index) => index));
    } else {
      setSelectedItems([]); // Deseleccionar todos
    }
  };

  const handleDeleteSelected = () => {
    // Obtener todos los registros desde localStorage
    const allRegisters = JSON.parse(localStorage.getItem("register")) || [];

    // Obtener todos los registros filtrados
    const filteredRegisters = allRegisters.filter((register) => {
      return (
        (!filtersSelect.Asesora ||
          register.asesora === filtersSelect.Asesora) &&
        (!filtersSelect.Servicio ||
          register.servicio === filtersSelect.Servicio) &&
        (!filtersSelect.MetodoPago ||
          register.metodoPago === filtersSelect.MetodoPago)
      );
    });

    // Crear un nuevo array sin los registros seleccionados
    const updatedRegisters = allRegisters.filter((register, index) => {
      const isSelected = selectedItems.includes(index);
      const isFiltered = filteredRegisters.includes(register);
      return !(isSelected && isFiltered);
    });

    const total = updatedRegisters.reduce(
      (acc, curr) => acc + parseInt(curr.pago, 10),
      0
    );
    setTotal(total);

    // Actualizar el estado y el localStorage
    setRegisters(updatedRegisters);
    localStorage.setItem("register", JSON.stringify(updatedRegisters));

    // Limpiar selección
    setSelectedItems([]);
  };

  const calculateNomina = () => {
    if (filtersSelect.Asesora) {
      const porcentajePorServicio = {
        Promocion: PROMOCION_PORC,
        Completo: COMPLETO_PORC,
        Organica: ORGANICA_PORC,
        Corte: CORTE_PORC,
        Lavado: CORTE_PORC, // Asumo que "Lavado" comparte el porcentaje de "Corte"
        Hidratacion: HIDRATACION_PORC
      };
    
      const totalNomina = registers.reduce(
        (accumulator, { servicio, adicional }) => {
          // Agregar el porcentaje del servicio si existe
          if (porcentajePorServicio[servicio]) {
            accumulator += porcentajePorServicio[servicio];
          }
    
          // Agregar el porcentaje del adicional si existe
          if (porcentajePorServicio[adicional]) {
            accumulator += porcentajePorServicio[adicional];
          }
    
          return accumulator; // Retornamos el acumulador para la siguiente iteración
        },
        0
      ); // El valor inicial del acumulador es 0
    
      setTotal(totalNomina); // Actualizar el total
    }
  };

  return (
    <section className="home">
      <div>
        <h2>Inicio</h2>
      </div>
      <div className="d-flex">
        <button onClick={openModal} className="btn btnAddRegister me-3">
          <i className="bi bi-plus-circle-fill me-2"></i>Agregar Registro
        </button>
        {/* Botón para descargar a Excel */}
        <ExportExcel board={registers} />

        <button
          onClick={calculateNomina}
          disabled={!filtersSelect.Asesora}
          className="btn btnAddRegister me-3">
          <i className="bi bi-cash-coin me-2"></i>nómina
        </button>
      </div>

      {/* Filtros */}
      <div className="filter">
        <select
          value={filtersSelect.Asesora || ""}
          className="form-select"
          onChange={(e) => onChangeSelect(e, "Asesora")}>
          <option value="">Asesora</option>
          <option value="Valentina">Valentina</option>
          <option value="Alejandra">Alejandra</option>
          <option value="Yelimar">Yelimar</option>
          <option value="Daniela">Daniela</option>
          <option value="Stefania">Stefania</option>
        </select>

        <select
          className="form-select"
          value={filtersSelect.Servicio || ""}
          onChange={(e) => onChangeSelect(e, "Servicio")}>
          <option value="">Servicio</option>
          <option value="Promocion">Promocion</option>
          <option value="Completo">Completo</option>
          <option value="Organica">Organica</option>
        </select>

        <select
          className="form-select"
          value={filtersSelect.MetodoPago || ""}
          onChange={(e) => onChangeSelect(e, "MetodoPago")}>
          <option value="">Metodo de pago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <button className="btn btn-limpiar-filtros w-50" onClick={clearFilters}>
          Limpiar
        </button>

        {/* Botón para eliminar elementos seleccionados */}
        <button
          className="btn btn-danger w-50"
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0}>
          <i className="bi bi-trash3-fill me-2"></i>
          Eliminar
        </button>
      </div>

      <table className="table table-striped table-hover mt-4">
        <thead className="table-dark">
          <tr className="text-center">
            <th scope="col">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={handleSelectAll}
                checked={
                  selectedItems.length === registers.length &&
                  registers.length > 0
                }
              />
            </th>
            <th scope="col">Asesora</th>
            <th scope="col">Servicio</th>
            <th scope="col">Adicional</th>
            <th scope="col">Pago</th>
            <th scope="col">Método de Pago</th>
            <th scope="col">{<FechaHora />}</th>
          </tr>
        </thead>
        <tbody>
          {registers.map((register, index) => (
            <tr className="text-center" key={index}>
              <td>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedItems.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>{register.asesora}</td>
              <td>{register.servicio}</td>
              <td>{register.adicional}</td>
              <td>{formatCurrency(register.pago)}</td>
              <td>{register.metodoPago}</td>
              <td>x</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Total: {formatCurrency(total)}</h2>

      {/* Modal para agregar registro */}
      <ModalAddRegister onClose={() => {}} refreshData={handleRefresh} />

      {/* Asegúrate de tener un modal con id "addRegisterModal" en tu HTML */}
    </section>
  );
};

export default Home;
