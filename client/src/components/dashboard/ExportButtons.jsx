import html2pdf from "html2pdf.js";

function ExportButtons() {

    // PDF Export

const exportPDF = () => {

    const element = document.getElementById("dashboard-report");

    const options = {

        margin: 0.4,

        filename: "Customer_Insight_Report.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 3,
            useCORS: true
        },

        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        }

    };

    html2pdf().set(options).from(element).save();

};

    // Excel Export
    const exportExcel = () => {
        window.open(
            "http://127.0.0.1:5000/export/excel",
            "_blank"
        );
    };

    // CSV Export
    const exportCSV = () => {
        window.open(
            "http://127.0.0.1:5000/export/csv",
            "_blank"
        );
    };

    return (

        <div className="export-buttons">

            <button onClick={exportPDF}>
                Export PDF
            </button>

            <button onClick={exportExcel}>
                Export Excel
            </button>

            <button onClick={exportCSV}>
                Export CSV
            </button>

        </div>

    );

}

export default ExportButtons;