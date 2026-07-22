import {
    FaDatabase,
    FaFileCsv,
    FaTable,
    FaCalendarAlt,
    FaCheckCircle
} from "react-icons/fa";

import "../../styles/datasetinfo.css";

function DatasetInfo({ info, cleaning }) {

    if (!info || !cleaning) return null;

    return (

        <div className="dataset-card">

            <div className="dataset-header">

                <h2>
                    <FaDatabase />
                    Dataset Information
                </h2>

            </div>

            <div className="dataset-grid">

                <div className="dataset-item">

                    <FaFileCsv />

                    <div>

                        <span>Dataset</span>

                        <h3>{info.dataset_name}</h3>

                    </div>

                </div>

                <div className="dataset-item">

                    <FaTable />

                    <div>

                        <span>Rows</span>

                        <h3>{cleaning.total_rows}</h3>

                    </div>

                </div>

                <div className="dataset-item">

                    <FaTable />

                    <div>

                        <span>Columns</span>

                        <h3>{cleaning.total_columns}</h3>

                    </div>

                </div>

                <div className="dataset-item">

                    <FaCalendarAlt />

                    <div>

                        <span>Last Updated</span>

                        <h3>{info.last_updated}</h3>

                    </div>

                </div>

                <div className="dataset-item">

                    <FaCheckCircle />

                    <div>

                        <span>Quality Score</span>

                        <h3>{cleaning.quality_score}%</h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DatasetInfo;