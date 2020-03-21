function Card() {
    return {
        type: "", //U - upgrade, C - converter, P - pick, B - build, 'F' - file
        effect: null,
        victoryPoints: 0,
        color: "", //R - Red, B - Black, U - Blue, Y - Yellow, RUBY - Any
        cost: 0
    };
}

function InitialCard() {
    return Card();
}

const Level_I_cards = Array(36).fill(Card());
const Level_II_cards = Array(36).fill(Card());
const Level_III_cards = Array(36).fill(Card());

export { Card, Level_I_cards, Level_II_cards, Level_III_cards, InitialCard };