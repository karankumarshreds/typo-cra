import { EventHandler, FormEvent, useEffect, useState } from "react";

async function fetchWord(): Promise<string[]> {
	const result = await fetch('https://random-word-api.herokuapp.com/all');
	return await result.json();
}

let interval: NodeJS.Timer;
let intervalMS: NodeJS.Timer;

function App() {
	const [word, setWord] = useState<string>("");
	const [words, setWords] = useState<string[]>([]);
	const [value, setValue] = useState<string>("");
	const [error, setError] = useState<boolean>(false);
	const [score, setScore] = useState<number | string>("");
	const [timer, setTimer] = useState<number>(0);
	const [timerMS, setTimerMS] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		(async function () {
			setLoading(true);
			const result = await fetchWord() || [];
			setLoading(false);
			setWords(result as string[]);
		}());
	}, []);

	function startCounter(word: string) {
		if (!word) return;
		let secs = Math.floor(word.length / 3);
		let ms = 60;
		setTimer(secs);
		clearInterval(interval);

		interval = setInterval(() => {
			if (secs === 0) {
				setError(true);
				return clearInterval(interval);
			}
			secs -= 1;
			setTimer(secs);
		}, 1000);

		intervalMS = setInterval(() => {
			if (ms === 0) {
				ms = 60;
			}
			ms -= 1;
			setTimerMS(ms);
		}, 100 / 6);
	}

	useEffect(() => {
		console.log('setting new word');
		const rand = Math.random();
		const word = words[Math.floor(rand * words.length)];
		if (!word) return;
		setWord(word);
		console.log({ word });
		startCounter(word);
	}, [score, words]);

	function submit<T>(e: FormEvent) {
		e.preventDefault();
		if (value !== word) return setError(true);
		if (typeof score === 'number') {
			setScore((score) => score as number + 1);
		}
		setValue("");
	}

	function reset() {
		setError(false);
		setValue("");
		setScore(0);
		clearInterval(interval);
		clearInterval(intervalMS);
	}

	if (error) return <>
		<h1>OOPS! Score: {score}</h1>
		<button onClick={reset}>Restart</button>
	</>;

	return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
		<form onSubmit={submit}>
			{
				loading ? <h4>loading...</h4> :
					<div>
						<h1>Time Left: {timer}:{timerMS}</h1>
						<h1>{score}</h1>
						<h2>{word}</h2>
						<div style={{ height: 11, width: 400, outline: 'black', transition: 'all 2s ease-in' }}>
							<div style={{ height: 10, width: `${timer / word.length * 100}%`, backgroundColor: 'teal', margin: 'auto' }} />
						</div>
					</div>
			}
			<input value={value} onChange={(e) => setValue(e.target.value)} style={{ width: 400, padding: 50 }} />
		</form>
		<button onClick={reset}>Restart</button>
	</div>
}

export default App;