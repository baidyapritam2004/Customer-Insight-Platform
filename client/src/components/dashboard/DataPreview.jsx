import "../../styles/datapreview.css";

function DataPreview({ data }) {

    if (!data || data.length === 0) {

        return (

            <div className="preview-card">

                <h2>Dataset Preview</h2>

                <p>No preview available.</p>

            </div>

        );

    }

    const columns = Object.keys(data[0]);

    return (

        <div className="preview-card">

            <div className="preview-header">

                <div>

                    <h2>Dataset Preview</h2>

                    <p>

                        Showing first <strong>{data.length}</strong> rows

                    </p>

                </div>

                <div className="preview-badge">

                    {columns.length} Columns

                </div>

            </div>

            <div className="preview-table">

                <table>

                    <thead>

                        <tr>

                            {

                                columns.map((column) => (

                                    <th key={column}>

                                        {column}

                                    </th>

                                ))

                            }

                        </tr>

                    </thead>

                    <tbody>

                        {

                            data.map((row, index) => (

                                <tr key={index}>

                                    {

                                        columns.map((column) => (

                                            <td key={column}>

                                                {String(row[column])}

                                            </td>

                                        ))

                                    }

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default DataPreview;