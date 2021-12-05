let baseURL = "http://numbersapi.com/";
let favoriteNum = 15;
const singleNum = document.querySelector("p");

// PART 1 ****** NUMBER FACTS *******
//1.
let response = axios.get(`${baseURL}${favoriteNum}?json`);
response
	.then((res) => {
		singleNum.textContent = res.data.text;
	})
	.catch((err) => console.log(err));

// Multiple numbers in a single request
let min = 1;
let max = 5;

// 2.
let response2 = axios.get(`${baseURL}${min}..${max}?json`);
response2
	.then((res) => {
		for (let i = min; i <= max; i++) {
			console.log(res.data[i]);
			const ul = document.querySelector(".multiple-res");
			const li = document.createElement("li");
			li.append(res.data[i]);
			ul.append(li);
		}
	})
	.catch((err) => console.log(err));

// 3;
Promise.all(
	// The axios.get function runs 4 times because of {length: 4}
	Array.from({ length: 4 }, () => {
		return axios.get(`${baseURL}${favoriteNum}?json`);
	})
)
	.then((data) => {
		const span = document.querySelector("span");
		span.append(`${favoriteNum}`);
		for (let res of data) {
			const ul = document.querySelector(".multiple-res-same-num");
			const li = document.createElement("li");
			li.append(res.data.text);
			ul.append(li);
		}
	})
	.catch((err) => console.log(err));

// PART 2 ****** DECK OF CARDS *******
let response3 = axios
	.get("http://deckofcardsapi.com/api/deck/new/draw/?count=1")
	.then((res) => {
		const value = res.data.cards[0].value;
		const suit = res.data.cards[0].suit;
		console.log(`${value} of ${suit}`);
	});

let firstCard = null;
let response4 = axios
	.get("http://deckofcardsapi.com/api/deck/new/draw/?count=1")
	.then((res) => {
		let deckID = res.data.deck_id;
		firstCard = res.data.cards[0];
		return axios.get(
			`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
		);
	})
	.then((res) => {
		let secondCard = res.data.cards[0];
		[firstCard, secondCard].forEach((el) => {
			console.log(`${el.value} of ${el.suit} `);
		});
	});
// Hide the button
const btn = document.querySelector("button");
btn.style.visibility = "hidden";
let deckID = null;

document.addEventListener("DOMContentLoaded", function () {
	axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/").then((res) => {
		deckID = res.data.deck_id;
		btn.style.visibility = "";
	});
});

btn.addEventListener("click", () => {
	axios
		.get(`http://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
		.then((res) => {
			console.log(res.data);
			console.log(res.data.cards[0].image);
			const img = document.createElement("img");
			let angle = Math.random() * 90 - 45;
			let randomX = Math.random() * 40 - 20;
			let randomY = Math.random() * 40 - 20;
			img.src = res.data.cards[0].image;
			img.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`;
			const imgDiv = document.querySelector(".card-area");
			imgDiv.append(img);
			if (res.data.remaining === 0) {
				btn.removeEventListener("click", (btn.style.visibility = "hidden"));
			}
		})
		.catch((err) => console.log(err, "LISTENER NOT WORKING!"));
});
