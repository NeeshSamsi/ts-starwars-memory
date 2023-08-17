import React from "react";

// Types
import { CardType } from "./setup";

// Setup
import { createBoard } from "./setup";
import { shuffleArray } from "./utils";

// Styles
import { Grid } from "./App.styles";

// Components
import Card from "./components/Card";

const timeTillFlipBack = 1 * 1000;

const App = () => {
  const [cards, setCards] = React.useState<CardType[]>(shuffleArray(createBoard()));
  const [gameWon, setGameWon] = React.useState(false);
  const [matchedPairs, setMatchedPairs] = React.useState(0);
  const [clickedCard, setClickedCard] = React.useState<undefined | CardType>(undefined);

  React.useEffect(() => {
    if (matchedPairs === cards.length / 2) {
      console.log("Game WON!");
      setGameWon(true);
    }
  }, [matchedPairs]);

  const handleCardClick = (currentClickedCard: CardType) => {
    console.log(currentClickedCard);
    // FLIP CARD
    setCards((prev) =>
      prev.map((card) => (card.id === currentClickedCard.id ? { ...card, flipped: true, clickable: false } : card))
    );

    // If this is the first card input, keep it flipped, wait for next input
    if (!clickedCard) {
      setClickedCard({ ...currentClickedCard });
      return;
    }

    // This is now second input, If it's a match
    if (clickedCard.matchingCardID === currentClickedCard.id) {
      setMatchedPairs((prev) => prev++);
      setCards((prev) =>
        prev.map((card) =>
          card.id === clickedCard.id || card.id === currentClickedCard.id ? { ...card, clickable: false } : card
        )
      );
      setClickedCard(undefined);
      return;
    }

    // If not matched pair, wait 1 sec and flip back
    setTimeout(() => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === clickedCard.id || card.id === currentClickedCard.id
            ? { ...card, flipped: false, clickable: true }
            : card
        )
      );
    }, timeTillFlipBack);
    setClickedCard(undefined);
  };

  return (
    <div>
      <Grid>
        {cards.map((card) => (
          <Card key={card.id} card={card} callback={handleCardClick} />
        ))}
      </Grid>
    </div>
  );
};

export default App;
