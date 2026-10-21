const bookGrid = document.querySelector("#book-grid");
const status = document.querySelector("#status");
const bookCount = document.querySelector("#book-count");
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function getRequiredText(book, selector) {
  const element = book.querySelector(selector);
  const value = element?.textContent.trim();

  if (!value) {
    const id = book.getAttribute("id") || "unknown";
    throw new Error(`Book ${id} is missing a required ${selector} value.`);
  }

  return value;
}

function createBookCard(book, index) {
  const id = book.getAttribute("id");
  const title = getRequiredText(book, "title");
  const author = getRequiredText(book, "author");
  const price = Number(getRequiredText(book, "price"));

  if (!id) {
    throw new Error("A book is missing its id attribute.");
  }

  if (!Number.isFinite(price)) {
    throw new Error(`Book ${id} has an invalid price.`);
  }

  const card = document.createElement("article");
  card.className = "book-card";
  card.style.setProperty("--card-index", index);

  const cardTop = document.createElement("div");
  cardTop.className = "card-top";

  const catalogNumber = document.createElement("span");
  catalogNumber.className = "catalog-number";
  catalogNumber.textContent = id;

  const bookMark = document.createElement("span");
  bookMark.className = "book-mark";
  bookMark.setAttribute("aria-hidden", "true");

  const details = document.createElement("div");
  details.className = "book-details";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const authorLine = document.createElement("p");
  authorLine.className = "author";
  authorLine.textContent = `by ${author}`;

  const cardBottom = document.createElement("div");
  cardBottom.className = "card-bottom";

  const label = document.createElement("span");
  label.textContent = "Catalogue price";

  const priceText = document.createElement("strong");
  priceText.textContent = currency.format(price);

  cardTop.append(catalogNumber, bookMark);
  details.append(heading, authorLine);
  cardBottom.append(label, priceText);
  card.append(cardTop, details, cardBottom);

  return card;
}

function showError(message) {
  status.className = "status is-error";
  status.textContent = message;
  bookGrid.replaceChildren();

  const errorPanel = document.createElement("div");
  errorPanel.className = "error-panel";

  const heading = document.createElement("h3");
  heading.textContent = "The catalogue could not be loaded.";

  const explanation = document.createElement("p");
  explanation.textContent =
    "Check that book.xml is available and that the page is running through a web server.";

  errorPanel.append(heading, explanation);
  bookGrid.append(errorPanel);
}

async function loadCatalogue() {
  try {
    const response = await fetch("book.xml", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const parseError = xmlDoc.querySelector("parsererror");

    if (parseError) {
      throw new Error("book.xml is not well-formed.");
    }

    const books = Array.from(xmlDoc.querySelectorAll("book"));

    if (books.length === 0) {
      throw new Error("No book elements were found in book.xml.");
    }

    const cards = books.map(createBookCard);
    bookGrid.replaceChildren(...cards);
    bookCount.textContent = String(books.length).padStart(2, "0");
    status.className = "status is-success";
    status.textContent = `${books.length} books loaded from book.xml`;
  } catch (error) {
    console.error("Catalogue error:", error);
    showError(`Catalogue error: ${error.message}`);
  }
}

loadCatalogue();
