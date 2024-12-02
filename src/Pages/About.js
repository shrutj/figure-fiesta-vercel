// src/pages/About.js
import React from 'react';
import './Styles/About.css'
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
    return (
        <div className="about-us-container">
            <h2>About Us</h2>
            <p>
                Welcome to <strong>Figure Fiesta</strong>, your ultimate destination for everything related to action figures, collectibles, and fan gear! Whether you're a passionate collector, a cosplay enthusiast, or someone who simply wants to express their fandom in style, we have something for you. Our expansive collection spans a wide range of products, from action figures and accessories to exclusive T-shirts, neon logos, cosplay outfits, and even realistic action props.
            </p>
            <p>
                At <strong>Figure Fiesta</strong>, we believe that fandom is more than just a hobby; it’s a lifestyle. We’re here to help you embody the spirit of your favorite characters and stories through the finest quality merchandise. Whether you’re looking for a rare collectible to complete your collection, a unique piece to wear, or accessories that bring your fandom to life, our carefully curated selection is designed to cater to fans of all kinds.
            </p>
            <p>
                We take pride in offering not just products but experiences—each item in our collection has been handpicked for its quality, authenticity, and connection to the fandom. Our exclusive designs, like our oversized T-shirts, are created to give fans the opportunity to wear their love for their favorite characters with pride. And with a variety of action props, neon logos, and cosplay essentials, we help fans immerse themselves in the world of their favorite universes.
            </p>
            <p>
                Located in the heart of <strong>Indore</strong>, our physical store at <strong>UG-17, One Center, Chappan Dukan, New Palasia, Indore, Madhya Pradesh 452001</strong> is a haven for fans who wish to explore our collection in person. From the latest releases to timeless classics, we invite you to visit us and find the perfect piece that resonates with your fandom.
            </p>
            <p>
                Our mission is simple: to provide fans with the tools they need to express their passion, creativity, and pride. We are dedicated to making fandom a lifestyle, and we hope that through our wide range of products, we can bring fans closer to the characters and stories they love.
            </p>
            <p>
                Thank you for choosing <strong>FigureFiesta</strong>—where every fan is a hero!
            </p>
            <p>
                For inquiries, collaborations, or questions, feel free to get in <strong onClick={() => navigate('/contact')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>touch</strong> with us!
            </p>
        </div>
    );
}

export default About;
