import { EthProvider } from "./contexts/EthContext";
import { GameBoard } from "./components/Board/GameBoard";
function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
        <GameBoard />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
