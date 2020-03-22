function Card() {
    return {
        cardId: 0,
        type: "", //U - upgrade, C - converter, P - pick, B - build, 'F' - file
        effect: null,
        victoryPoints: 0,
        color: "", //R - Red, B - Black, U - Blue, Y - Yellow, RUBY - Any
        cost: 0,
        level: 0 //0,1,2,3
    };
}

function InitialCard() {
    let card = Card();
    card.level = 0;
    return card;
}

const Level_I_cards = Array(36).fill(Card());
const Level_II_cards = Array(36).fill(Card());
const Level_III_cards = Array(36).fill(Card());

function CardsList() {
    return Level_I_cards.concat(Level_II_cards, Level_III_cards);
}

export { Card, CardsList, InitialCard };