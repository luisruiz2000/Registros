import { useEffect, useState } from "react";
import { ASESORAS, SERVICIOS, PORCENTAJES } from "../../Constants/constants"; // Asegúrate de que la ruta sea correcta
import "./contabilidad.css";
import AddGastos from "../../shared/ModalAddGastos/AddGastos";

const Contabilidad = () => {
  const [registers, setRegisters] = useState([]);
  const [gastos, setGastos] = useState("");
  const [efectivo, setEfectivo] = useState(0);
  const [transferencias, setTransferencias] = useState(0);

  useEffect(() => {
    // Obtener los registros del localStorage
    const getRegisterStorage =
      JSON.parse(localStorage.getItem("register")) || [];

    const gastosTotal = localStorage.getItem("gastos");
    setGastos(gastosTotal);
    setRegisters(getRegisterStorage);
  }, []);

  const agregarGastos = () => {
    const modal = new window.bootstrap.Modal(
      document.getElementById("addGastosModal")
    );
    modal.show();
  };

  const handleGastoAgregado = (nuevoTotal) => {
    setGastos(nuevoTotal);
  };

  // Función para contar servicios por asesora
  const contarServiciosPorAsesora = (asesora) => {
    const serviciosRealizados = {};

    // Inicializamos el contador de cada servicio
    SERVICIOS.forEach((servicio) => {
      serviciosRealizados[servicio] = 0;
    });

    // Filtramos los registros por asesora y contamos los servicios y adicionales
    registers
      .filter((register) => register.asesora === asesora)
      .forEach((register) => {
        const { servicio, adicional } = register;

        // Verificar si el 'servicio' está en SERVICIOS y aumentar su contador
        if (SERVICIOS.includes(servicio)) {
          serviciosRealizados[servicio] += 1;
        }

        // Verificar si el 'adicional' está en SERVICIOS y aumentar su contador también
        if (SERVICIOS.includes(adicional)) {
          serviciosRealizados[adicional] += 1;
        }
      });

    return serviciosRealizados;
  };

  // Función para calcular la nómina de cada asesora
  const calcularNominaPorAsesora = (asesora) => {
    let totalNomina = 0;

    // Cálculo para asesoras con nómina variable
    registers
      .filter((register) => register.asesora === asesora)
      .forEach(({ servicio, adicional }) => {
        if (servicio === "Promocion") {
          totalNomina += PORCENTAJES.PROMOCION_PORC;
        }
        if (servicio === "Completo") {
          totalNomina += PORCENTAJES.COMPLETO_PORC;
        }
        if (servicio === "Organica") {
          totalNomina += PORCENTAJES.ORGANICA_PORC;
        }
        if (adicional === "Corte" || adicional === "Lavado") {
          totalNomina += PORCENTAJES.CORTE_PORC;
        }
        if (adicional === "Hidratacion") {
          totalNomina += PORCENTAJES.HIDRATACION_PORC;
        }
      });

    return totalNomina;
  };

  // Método para filtrar y sumar pagos en efectivo
  const sumarPagosEfectivo = (register) => {
    const efectivoTotal = register
      .filter((item) => item.metodoPago === "Efectivo")
      .reduce((total, item) => total + parseInt(item.pago), 0);

    setEfectivo(efectivoTotal);
  };

  // Método para filtrar y sumar pagos por transferencia
  const sumarPagosTransferencia = (register) => {
    const transferenciasTotal = register
      .filter((item) => item.metodoPago === "Transferencia")
      .reduce((total, item) => total + parseInt(item.pago), 0);

    setTransferencias(transferenciasTotal);
  };

  useEffect(() => {
    sumarPagosEfectivo(registers);
    sumarPagosTransferencia(registers);
  }, [registers]);

  // Función para formatear la moneda
  const formatCurrency = (amount) => {
    if (isNaN(amount)) return amount;
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const limpiarGastos = () => {
    localStorage.setItem("gastos", "0");
    const gastosTotal = localStorage.getItem("gastos");
    setGastos(Number(gastosTotal));
  };

  // Calcular la suma total de nómina incluyendo a Dahiana y Valentina
  const calcularTotalNomina = () => {
    let totalNomina = ASESORAS.reduce(
      (total, asesora) => total + calcularNominaPorAsesora(asesora),
      0
    );

    // Añadir las nóminas fijas de Dahiana y Valentina
    totalNomina += 50000; // Nómina fija de Dahiana
    totalNomina += 65000; // Nómina fija de Valentina

    return totalNomina;
  };

  // Calcular utilidades: Total Producido - (Total Nómina + Total Gastos)
  const utilidades =
    efectivo + transferencias - (calcularTotalNomina() + parseFloat(gastos));

  return (
    <div className="contabilidad">
      <h2>Contabilidad</h2>
      <hr />

      <button onClick={agregarGastos} className="btn bg-warning me-3">
        <i className="bi bi-plus-circle-fill me-2"></i>Agregar Gasto
      </button>

      <section className="cantidadNomina">
        {ASESORAS.map((asesora) => {
          const serviciosPorAsesora = contarServiciosPorAsesora(asesora);

          const totalServicios = Object.values(serviciosPorAsesora).reduce(
            (acc, cantidad) => acc + cantidad,
            0
          );

          if (totalServicios === 0) {
            return null;
          }

          return (
            <div key={asesora} className="table">
              <h3>{asesora}</h3>
              <table className="table table-striped table-hover" style={{ width: "100%", marginBottom: "20px" }}>
                <thead className="table-dark">
                  <tr>
                    <th>Servicio</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICIOS.filter(
                    (servicio) => serviciosPorAsesora[servicio] > 0
                  ).map((servicio) => (
                    <tr key={servicio}>
                      <td>{servicio}</td>
                      <td>{serviciosPorAsesora[servicio]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      <section className="nomina">
        <div className="me-5">
          <h3>Nómina</h3>
          <ul>
            {ASESORAS.map((asesora) => {
              const nomina = calcularNominaPorAsesora(asesora);

              if (nomina > 0) {
                return (
                  <li className="itemNomina" key={asesora}>
                    {asesora}: ${formatCurrency(nomina)}
                  </li>
                );
              }
              return null; 
            })}
            {/* Mostrar nómina fija de Dahiana */}
            <li className="itemNomina">Dahiana: $50,000</li>
            {/* Mostrar nómina fija de Valentina */}
            <li className="itemNomina">Valentina: $65,000</li>

            {/* Mostrar Total de Gastos */}
            <li className="itemNomina">
              Total de Gastos: ${formatCurrency(gastos)}
              <i className="bi bi-trash3-fill limpiar_gastos" onClick={limpiarGastos}></i>{" "}
            </li>
          </ul>
        </div>

        <div className="me-5">
          <h3>Producido del día</h3>
          {efectivo > 0 && (
            <li className="itemNomina">
              Total Efectivo:<b> ${formatCurrency(efectivo)}</b>
            </li>
          )}
          {transferencias > 0 && (
            <li className="itemNomina">
              Total Transferencia:<b> ${formatCurrency(transferencias)}</b>
            </li>
          )}

          {/* Mostrar Total producido */}
          <h3 className="mt-3">
            Total producido:{" "}
            <b> ${formatCurrency(efectivo + transferencias)}</b>
          </h3>

        </div>
        <h1>Utilidades: ${formatCurrency(utilidades)}</h1>
      </section>

      {/* Agrega el componente AddGastos y pasa la función handleGastoAgregado */}
      <AddGastos onGastoAgregado={handleGastoAgregado} />
    </div>
  );
};

export default Contabilidad;