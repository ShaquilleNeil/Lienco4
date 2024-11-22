import React from 'react';
import Slider from 'react-slick';
import './swiper.css';  // Import your custom CSS for cards

const Carousel = () => {
  // Slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  // Adjust based on how many cards you want visible at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div className="card">
          <a href="/projects" className="card-link">
            <h3>Project 1</h3>
            <p>Description of the project.</p>
          </a>
        </div>
        <div className="card">
          <a href="/resources" className="card-link">
            <h3>Resource 1</h3>
            <p>Details about the resource.</p>
          </a>
        </div>
        <div className="card">
          <a href="/projects" className="card-link">
            <h3>Project 2</h3>
            <p>Description of the project.</p>
          </a>
        </div>
        {/* Add more cards here */}
      </Slider>
    </div>
  );
};

export default Carousel;
