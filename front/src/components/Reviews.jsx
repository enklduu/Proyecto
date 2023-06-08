import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (review) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/reviews/${review.id}`,
        review,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Actualizar en el lado del cliente
      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReviewList = () => {
    setShowReviews(!showReviews);
  };

  return (
    <div className="container text-center">
      <div className="row">
        <hr />
        <div className="col-md-12">
          <h2 onClick={toggleReviewList} style={{ cursor: "pointer" }}>
            {showReviews ? "Lista de reseñas" : "Lista de reseñas"}
          </h2>
          {showReviews &&
            (reviews.length === 0 ? (
              <p>No hay pedidos antiguos.</p>
            ) : (
              <div>
                {reviews.map((review) => (
                  <div key={review.id} className="card mb-3">
                    <div className="card-body">
                      <p className="card-text">Texto: {review.text}</p>
                      <p className="card-text">
                        Valoration: {review.valoration}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleClick(review)}
                    >
                      {review.visible ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
