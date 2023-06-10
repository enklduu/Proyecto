/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const ProductInfo = () => {
  const data = useLoaderData();
  const [text, setText] = useState("");
  const [valoration, setValoration] = useState(null);
  const [starsSelected, setStarsSelected] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user")).id;

  const handleToggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleValorationChange = (event) => {
    setValoration(event.target.value);
    setStarsSelected(parseInt(event.target.value));
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const renderStars = (valoration) => {
    const stars = [];
    for (let i = 0; i < valoration; i++) {
      stars.push(<span key={i}>&#9733;</span>);
    }
    return stars;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!valoration || !text) {
      alert("Por favor, rellena todos los campos del formulario.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("valoration", valoration);
    formData.append("user", currentUser);
    formData.append("product", data.data.id);

    fetch("http://127.0.0.1:8000/api/createReview", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNewReview(data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Limpiar campos
    setText("");
    setValoration(null);
    setStarsSelected(0);
    setShowReviewForm(false);
  };
  return (
    <div className="container mt-3">
      <div className="card m-auto" style={{ maxWidth: "30rem" }}>
        <img
          className="card-img-top img-fluid"
          src={"../images/products/" + data.data.img}
          alt="Card image"
        />
        <div className="card-body">
          <h5 className="card-title">{data.data.name}</h5>
          <p className="card-text">{data.data.description}</p>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button
            onClick={handleToggleReviewForm}
            className="btn btn-primary flex-grow-1 m-1"
          >
            {showReviewForm ? "Cancelar" : "Añadir reseña"}
          </button>
          <Link to={"/products"} className="btn btn-primary flex-grow-1 m-1">
            Volver
          </Link>
        </div>
      </div>

      {showReviewForm && (
        <div className="mt-5 mx-auto" style={{ maxWidth: "25rem" }}>
          <div className="mx-auto">
            <form onSubmit={handleFormSubmit}>
              <div className="container">
                <div className="form-group text-center shadow p-3 mb-5 bg-white rounded">
                  <h3>Añadir reseña</h3>
                  <div className="form-group">
                    <textarea
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Escribe tu reseña..."
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="estrellas-mini">
                    <input
                      type="radio"
                      id="estrella5"
                      name="puntuacion"
                      value="5"
                      onChange={handleValorationChange}
                      checked={starsSelected === 5}
                    />
                    <label htmlFor="estrella5">&#9733;</label>
                    <input
                      type="radio"
                      id="estrella4"
                      name="puntuacion"
                      value="4"
                      onChange={handleValorationChange}
                      checked={starsSelected === 4}
                    />
                    <label htmlFor="estrella4">&#9733;</label>
                    <input
                      type="radio"
                      id="estrella3"
                      name="puntuacion"
                      value="3"
                      onChange={handleValorationChange}
                      checked={starsSelected === 3}
                    />
                    <label htmlFor="estrella3">&#9733;</label>
                    <input
                      type="radio"
                      id="estrella2"
                      name="puntuacion"
                      value="2"
                      onChange={handleValorationChange}
                      checked={starsSelected === 2}
                    />
                    <label htmlFor="estrella2">&#9733;</label>
                    <input
                      type="radio"
                      id="estrella1"
                      name="puntuacion"
                      value="1"
                      onChange={handleValorationChange}
                      checked={starsSelected === 1}
                    />
                    <label htmlFor="estrella1">&#9733;</label>
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary">
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-center mt-3">Reseñas</h2>
      <div className="reviews-container">
        {newReview && (
          <>
            <h4 className="text-center">Reseña reciente</h4>
            <ul className="reviews-list">
              <li className="review current-user-review">
                <p>{newReview.username}</p>
                <div>{newReview.text}</div>
                {renderStars(newReview.valoration)}
              </li>
            </ul>
          </>
        )}
        {(data.data.reviews.length === 0 ||
          data.data.reviews.every((review) => review.visible === false)) &&
        newReview == null ? (
          <p className="text-center">No hay reseñas aún.</p>
        ) : (
          <ul className="reviews-list">
            {data.data.reviews
              .filter((review) => review.visible !== false)
              .map((review, index) => (
                <li
                  key={index}
                  className={`review ${
                    review.user === currentUser ? "current-user-review" : ""
                  }`}
                >
                  <p>{review.userName}</p>
                  <div>{review.text}</div>
                  {renderStars(review.valoration)}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
