// Card.jsx
import React from 'react';
import './Card.css'; // Create a CSS file for card styles

const Card = ({ title, description, imageUrl }) => {
  return (
    <article className="card">
      <img
        className="card__background"
        src={imageUrl}
        alt={title}
        width="1920"
        height="2193"
      />
      <div className="card__content flow">
        <div className="card__content--container flow">
          <h2 className="card__title">{title}</h2>
          <p className="card__description">{description}</p>
        </div>
        <button className="card__button">Go</button>
      </div>
    </article>
  );
};

export default Card;
