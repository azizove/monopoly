import React from "react";
import PlayerNumber from "../PlayerNumber/PlayerNumber";

import './profileCard.css';
export const ProfileCard = () => {
  return (
    <React.Fragment>
      <div class="card">
        <img src="https://lh3.googleusercontent.com/oUUiPB9sq3ACq4bUaRmo8pgvC4FUpRRrQKcGIBSOsafawZfRpF1vruFeYt6uCfL6wGDQyvOi6Ez9Bpf1Fb7APKjIyVsft7FLGR6QqdRFTiceNQBm1In9aZyrXp33cZi9pUNqjHASdA=s170-no" alt="Person" class="card__image" />
        <p class="card__name">Murray Reeve</p>
        <div class="grid-container">
            <PlayerNumber />

        </div>
        <button class="btn draw-border">Follow</button>
        <button class="btn draw-border">Message</button>
      </div>
    </React.Fragment>
  );
};
