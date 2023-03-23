import React from "react";
import './PropertyCard.css';
export const PropertyCard = () => {
    return (
      <React.Fragment>
        <div class="wrapper">
          <div class="box">
            <h2>
              <small>title deed</small>
              <br />
              Indiana Ave.
            </h2>
            <p class="align-center">Rent $18</p>
            <div class="clear-both">
              <div class="float-left">With 1 House</div>
              <div class="float-right">$90</div>
              <br />
              <div class="float-left">With 2 House</div>
              <div class="float-right">250</div>
              <br />
              <div class="float-left">With 3 House</div>
              <div class="float-right">700</div>
              <br />
              <div class="float-left">With 4 House</div>
              <div class="float-right">875</div>
            </div>
            <p class="align-center clear-both">With HOTEL $1050</p>
            <small class="align-center">Morgage Value $110</small>
          </div>
        </div>
      </React.Fragment>
    );
}