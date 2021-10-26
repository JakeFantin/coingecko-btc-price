import "./App.css";
import { useState } from "react";
import axios from "axios";
import { fiatCurrencies } from "./constants";

const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export default function App() {
  const [display, setDisplay] = useState(null);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [numBTC, setNumBTC] = useState(null);

  const checkCurrency = (currency) => {
    if (!fiatCurrencies.includes(currency)) {
      setError("Not a valid fiat currency.");
    }
  };

  const handleInputAmount = (e) => {
    setNumBTC(e.target.value);
  };
  const handleInputCurrency = (e) => {
    setCurrency(e.target.value);
    if (e.target.value.length === 3) {
      checkCurrency(e.target.value);
      return;
    }
    if (error) {
      setError(null);
    }
  };

  const fetchBTCData = async (currency) => {
    const response = await client.get(
      `/coins/bitcoin/market_chart?vs_currency=${currency}&days=0`
    );
    return response.data.prices[0][1];
  };

  const getBTCConversion = async (numBTC, currency) => {
    const currentPrice = await fetchBTCData(currency);
    const total = currentPrice * numBTC;
    setDisplay(`Total: ${total.toFixed(2)} ${currency}`);
  };

  return (
    <div className="App">
      <div className="main">
        {display && <div className="display">{display}</div>}
        <div className="inputArea">
          <input
            onChange={(e) => handleInputAmount(e)}
            type="number"
            placeholder="BTC"
            min={0}
          />
          <input
            className="currencyInput"
            onChange={(e) => handleInputCurrency(e)}
            type="text"
            pattern="[a-zA-Z]"
            placeholder="CAD"
            maxLength={3}
          />
          <button
            onClick={() => getBTCConversion(numBTC, currency)}
            disabled={
              !numBTC ||
              currency === null ||
              currency.length < 3 ||
              error !== null
            }
          >
            Submit
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
