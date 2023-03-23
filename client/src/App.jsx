import { EthProvider } from "./contexts/EthContext";
import { GameBoard } from "./components/Board/GameBoard";
import PlayerNumber from "./components/PlayerNumber/PlayerNumber";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
        <PlayerNumber />
        <GameBoard />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;