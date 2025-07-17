"use client";

import { useState } from "react";

const networks = [
  "Random",
  "American Express",
  "Discover",
  "Diners Club International",
  "Master Card",
  "Maestro",
  "Union Pay",
  "Visa",
];

const formats = ["CARD", "PIPE", "CSV", "SQL", "JSON", "XML"];

const months = [
  "Random",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [
  "Random",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
];

const quantities = [10, 50, 100, 500, 1000, 2000, 5000, 7000, 8000, 10000];

function luhnCheckDigit(number: string): number {
  let sum = 0;
  let doubleDigit = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return (10 - (sum % 10)) % 10;
}

function generateCardNumber(prefix: string, length: number): string {
  let number = prefix;
  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10).toString();
  }
  const checkDigit = luhnCheckDigit(number);
  return number + checkDigit.toString();
}

export default function Home() {
  const [network, setNetwork] = useState("Random");
  const [format, setFormat] = useState("CARD");
  const [hasDate, setHasDate] = useState(true);
  const [expirationMonth, setExpirationMonth] = useState("Random");
  const [expirationYear, setExpirationYear] = useState("Random");
  const [hasCvv, setHasCvv] = useState(true);
  const [cvv, setCvv] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [results, setResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const networkPrefixes: Record<string, string[]> = {
    "American Express": ["34", "37"],
    Discover: ["6011", "65", "644", "645", "646", "647", "648", "649"],
    "Diners Club International": ["36", "38", "39"],
    "Master Card": ["51", "52", "53", "54", "55"],
    Maestro: ["50", "56", "57", "58", "6"],
    "Union Pay": ["62"],
    Visa: ["4"],
  };

  function getRandomPrefix(network: string): string {
    if (network === "Random") {
      const allPrefixes = Object.values(networkPrefixes).flat();
      return allPrefixes[Math.floor(Math.random() * allPrefixes.length)];
    }
    const prefixes = networkPrefixes[network];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  function getRandomMonth(): string {
    if (expirationMonth === "Random") {
      return (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0");
    }
    const monthIndex = months.indexOf(expirationMonth);
    return monthIndex.toString().padStart(2, "0");
  }

  function getRandomYear(): string {
    if (expirationYear === "Random") {
      const year = 2025 + Math.floor(Math.random() * 9);
      return year.toString();
    }
    return expirationYear;
  }

  function getRandomCvv(): string {
    return Math.floor(100 + Math.random() * 900).toString();
  }

  function formatCard(
    cardNumber: string,
    expMonth: string,
    expYear: string,
    cvvCode: string
  ): string {
    switch (format) {
      case "CARD":
        return `${cardNumber} | ${expMonth}/${expYear} | ${cvvCode}`;
      case "PIPE":
        return `${cardNumber}|${expMonth}|${expYear}|${cvvCode}`;
      case "CSV":
        return `"${cardNumber}","${expMonth}","${expYear}","${cvvCode}"`;
      case "SQL":
        return `('${cardNumber}', '${expMonth}', '${expYear}', '${cvvCode}')`;
      case "JSON":
        return JSON.stringify({
          cardNumber,
          expirationMonth: expMonth,
          expirationYear: expYear,
          cvv: cvvCode,
        });
      case "XML":
        return `<card><number>${cardNumber}</number><expMonth>${expMonth}</expMonth><expYear>${expYear}</expYear><cvv>${cvvCode}</cvv></card>`;
      default:
        return cardNumber;
    }
  }

  function generateCards() {
    setIsGenerating(true);
    const newResults: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const prefix = getRandomPrefix(network);
      const cardNumber = generateCardNumber(prefix, 16);
      const expMonth = hasDate ? getRandomMonth() : "";
      const expYear = hasDate ? getRandomYear() : "";
      const cvvCode = hasCvv ? (cvv ? cvv : getRandomCvv()) : "";
      newResults.push(formatCard(cardNumber, expMonth, expYear, cvvCode));
    }
    setResults(newResults);
    setIsGenerating(false);
  }

  function copyToClipboard() {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join("\n"));
  }

  function resetForm() {
    setResults([]);
    setNetwork("Random");
    setFormat("CARD");
    setHasDate(true);
    setExpirationMonth("Random");
    setExpirationYear("Random");
    setHasCvv(true);
    setCvv("");
    setQuantity(10);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Random Test Credit Card Numbers Generator</h1>

      <section className="mb-6">
        <label className="block mb-1 font-semibold">Network</label>
        <select
          className="w-full border rounded p-2"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          {networks.map((net) => (
            <option key={net} value={net}>
              {net}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-6">
        <label className="block mb-1 font-semibold">Format</label>
        <select
          className="w-full border rounded p-2"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          {formats.map((fmt) => (
            <option key={fmt} value={fmt}>
              {fmt}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-6 flex items-center space-x-4">
        <label className="font-semibold flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasDate}
            onChange={() => setHasDate(!hasDate)}
          />
          <span>Include Expiration Date</span>
        </label>
      </section>

      {hasDate && (
        <section className="mb-6 flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Expiration Month</label>
            <select
              className="w-full border rounded p-2"
              value={expirationMonth}
              onChange={(e) => setExpirationMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Expiration Year</label>
            <select
              className="w-full border rounded p-2"
              value={expirationYear}
              onChange={(e) => setExpirationYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section className="mb-6 flex items-center space-x-4">
        <label className="font-semibold flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasCvv}
            onChange={() => setHasCvv(!hasCvv)}
          />
          <span>Include CVV</span>
        </label>
      </section>

      {hasCvv && (
        <section className="mb-6">
          <label className="block mb-1 font-semibold">CVV (leave blank to randomize)</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            maxLength={4}
            placeholder="e.g. 123"
          />
        </section>
      )}

      <section className="mb-6">
        <label className="block mb-1 font-semibold">Quantity</label>
        <select
          className="w-full border rounded p-2"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        >
          {quantities.map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-6">
        <button
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50"
          onClick={generateCards}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </section>

      {results.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Generated Cards</h2>
          <textarea
            className="w-full border rounded p-2 h-48 resize-none"
            readOnly
            value={results.join("\n")}
          />
          <div className="mt-2 flex space-x-4">
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </button>
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
