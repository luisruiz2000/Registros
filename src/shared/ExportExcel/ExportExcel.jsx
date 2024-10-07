import * as XLSX from "xlsx"; // Importar xlsx

const ExportExcel = ({board}) => {

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(board);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    
        // Generar el archivo
        XLSX.writeFile(workbook, "registros.xlsx");
      };
    
  return (
    <div>
         <button className="btn btnAddRegister me-3" onClick={exportToExcel}>
         <i className="bi bi-file-earmark-spreadsheet-fill me-2"></i>
        Descargar Excel
      </button>
    </div>
  )
}

export default ExportExcel