/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./contabilidad.css";

const Contabilidad = () => {
  const [registers, setRegisters] = useState([]);
  const [asesoras, setAsesoras] = useState({
    valentina: [],
    alejandra: [],
    yelimar: [],
    daniela: [],
    stefani: [],
  });

  // Obtener registros del localStorage y setear asesores al cargar el componente
  useEffect(() => {
    const getRegisterStorage =
      JSON.parse(localStorage.getItem("register")) || [];
    setRegisters(getRegisterStorage);

    // Obtenemos una lista de los nombres de las asesoras
    const nombresAsesoras = Object.keys(asesoras);

    // Iterar sobre cada asesora y actualizar su estado
    const newAsesoras = { ...asesoras }; // Copiamos el estado original

    nombresAsesoras.forEach((nombre) => {
      // Filtrar los registros por asesora
      const registrosAsesora = getRegisterStorage.filter(
        (item) => item.asesora.toLowerCase() === nombre
      );

      // Agregar los registros filtrados a la asesora correspondiente
      newAsesoras[nombre] = registrosAsesora; // Solo actualizamos con los registros de esta carga
    });

    setAsesoras(newAsesoras); // Actualizamos el estado de una vez
  }, []); // Solo se ejecuta una vez al montar el componente

  const producido = (nombreAsesora, servicio) => {
    // Convertimos el nombre a minúsculas para la comparación
    nombreAsesora = nombreAsesora.toLowerCase();
  
    let cantServicios;
    let porcentajePorServicio = 0; // Inicializamos en 0
  
    if (asesoras[nombreAsesora]) {
      // Filtrar los registros que coinciden con el servicio pasado
      cantServicios = asesoras[nombreAsesora].filter((item) => item.servicio === servicio);
  
      // Solo sumar si hay servicios encontrados
      if (cantServicios.length > 0) {
        porcentajePorServicio = cantServicios.reduce((accumulator, item) => {
          // Evaluamos el servicio actual
          console.log(`Evaluando servicio: ${item.servicio}`);
  
          if (item.servicio === "Promocion") {
            console.log(`Aumentando por "Promocion": ${item.servicio}`);
            accumulator += 15000; // Se suma 15000 por cada "Promocion"
          }
  
          if (item.servicio === "Completo") {
            console.log(`Aumentando por "Completo": ${item.servicio}`);
            accumulator += 30000; // Se suma 30000 por cada "Completo"
          }
  
          if (item.servicio === "Organica") {
            console.log(`Aumentando por "Organica": ${item.servicio}`);
            accumulator += 25000; // Se suma 25000 por cada "Organica"
          }
  
          return accumulator; // Retornas el acumulador para la siguiente iteración
        }, 0); // Inicializamos el acumulador en 0
      }
    }


  
    console.log("====================================");
    console.log(cantServicios.length, servicio, porcentajePorServicio );
    console.log("====================================");
  };
  
  const ver = () => {
    producido("valentina", "Promocion");
  };
  

  return (
    <div className="contabilidad">
      <h2>Contabilidad</h2>
      <div className="d-flex">
        <button onClick={ver} className="btn bg-warning text-white me-3">
          <i className="bi bi-cash-coin me-2"></i>Sumar Gasto
        </button>
      </div>
    </div>
  );
};

export default Contabilidad;
