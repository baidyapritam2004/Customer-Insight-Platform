import {
    FaMedal,
    FaStar,
    FaStarHalfAlt,
    FaRegStar
} from "react-icons/fa";

import "../../styles/topproducts.css";

function TopProducts({ data }) {

    if (!data || data.length === 0) return null;

    const getMedal = (index) => {

        if(index===0) return "🥇";
        if(index===1) return "🥈";
        if(index===2) return "🥉";

        return `#${index+1}`;

    };

    const renderStars = (rating)=>{

        const stars=[];

        for(let i=1;i<=5;i++){

            if(rating>=i){

                stars.push(<FaStar key={i}/>);

            }

            else if(rating>=i-0.5){

                stars.push(<FaStarHalfAlt key={i}/>);

            }

            else{

                stars.push(<FaRegStar key={i}/>);

            }

        }

        return stars;

    }

    return (

        <div className="top-products-card">

            <div className="card-header">

                <h2>

                    <FaMedal />

                    Top Products

                </h2>

                <span>{data.length} Products</span>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Rank</th>

                        <th>Product</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Rating</th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((product,index)=>(

                        <tr key={index}>

                            <td className="rank">

                                {getMedal(index)}

                            </td>

                            <td className="product-name">

                                {product.Product}

                            </td>

                            <td>

                                <span className="category-badge">

                                    {product.Category}

                                </span>

                            </td>

                            <td className="price">

                                ₹{Number(product.Price).toLocaleString("en-IN")}

                            </td>

                            <td>

                                <div className="stars">

                                    {renderStars(product.Rating)}

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default TopProducts;