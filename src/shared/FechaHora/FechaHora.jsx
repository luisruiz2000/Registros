const FechaHora = () => {
  const fechaActual = new Date();

  // Obtener la fecha en formato YYYY-MM-DD
  const fecha = fechaActual.toLocaleDateString("en-CA"); // Cambiar el formato según tu necesidad

  return <div>{fecha}</div>;
};

export default FechaHora;
