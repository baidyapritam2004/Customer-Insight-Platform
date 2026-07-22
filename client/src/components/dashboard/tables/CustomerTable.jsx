import { useState, useMemo } from "react";
import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar
} from "react-icons/fa";

import "../../../styles/table.css";

function CustomerTable({ data }) {

    const [sortColumn,setSortColumn]=useState("");
    const [ascending,setAscending]=useState(true);
    const [currentPage,setCurrentPage]=useState(1);

    const rowsPerPage=10;

    const columns=data?.length ? Object.keys(data[0]) : [];

    const filteredData=useMemo(()=>{

        let temp=[...data];

        if(sortColumn){

            temp.sort((a,b)=>{

                if(a[sortColumn]<b[sortColumn])
                    return ascending?-1:1;

                if(a[sortColumn]>b[sortColumn])
                    return ascending?1:-1;

                return 0;

            });

        }

        return temp;

    },[data,sortColumn,ascending]);

    const totalPages=Math.ceil(filteredData.length/rowsPerPage)||1;

    const pageData=filteredData.slice(
        (currentPage-1)*rowsPerPage,
        currentPage*rowsPerPage
    );

    const renderStars=(rating)=>{

        const stars=[];

        for(let i=1;i<=5;i++){

            if(rating>=i){

                stars.push(<FaStar key={i}/>);

            }else if(rating>=i-.5){

                stars.push(<FaStarHalfAlt key={i}/>);

            }else{

                stars.push(<FaRegStar key={i}/>);

            }

        }

        return stars;

    };

    return(

<div className="table-card">

<div className="table-header">

<h2>Customer Products</h2>

<span className="record-count">

{filteredData.length} Records

</span>

</div>

<div className="table-wrapper">

<table>

<thead>

<tr>

{columns.map((column)=>(

<th
key={column}
onClick={()=>{

if(sortColumn===column){

setAscending(!ascending);

}else{

setSortColumn(column);
setAscending(true);

}

}}
>

{column}

{sortColumn===column && (ascending?" ▲":" ▼")}

</th>

))}

</tr>

</thead>

<tbody>

{pageData.map((row,index)=>(

<tr key={index}>

{columns.map((column)=>{

const value=row[column];

if(column==="Rating"){

return(

<td key={column}>

<div className="stars">

{renderStars(Number(value))}

</div>

</td>

);

}

if(column==="Category"){

return(

<td key={column}>

<span className="category-chip">

{value}

</span>

</td>

);

}

if(column==="Price"){

return(

<td
key={column}
className="price"
>

₹{Number(value).toLocaleString("en-IN")}

</td>

);

}

return(

<td key={column}>{value}</td>

);

})}

</tr>

))}

</tbody>

</table>

</div>

<div className="pagination">

<button
disabled={currentPage===1}
onClick={()=>setCurrentPage(currentPage-1)}
>

Previous

</button>

<span>

Page {currentPage} of {totalPages}

</span>

<button
disabled={currentPage===totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>

Next

</button>

</div>

</div>

);

}

export default CustomerTable;