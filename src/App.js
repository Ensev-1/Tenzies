import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import dieLogo from "./photos/die.png"
import diceFaceOne from "./photos/dice-six-faces-one.png"
import diceFaceTwo from "./photos/dice-six-faces-two.png"
import diceFaceThree from "./photos/dice-six-faces-three.png"
import diceFaceFour from "./photos/dice-six-faces-four.png"
import diceFaceFive from "./photos/dice-six-faces-five.png"
import diceFaceSix from "./photos/dice-six-faces-six.png"
import diceFaceOneFilled from "./photos/dice-six-faces-one-filled.png"
import diceFaceTwoFilled from "./photos/dice-six-faces-two-filled.png"
import diceFaceThreeFilled from "./photos/dice-six-faces-three-filled.png"
import diceFaceFourFilled from "./photos/dice-six-faces-four-filled.png"
import diceFaceFiveFilled from "./photos/dice-six-faces-five-filled.png"
import diceFaceSixFilled from "./photos/dice-six-faces-six-filled.png"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [time, setTime] = React.useState([0, 0])
    const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("bestTime")) || "none")
    const [rolls, setRolls] = React.useState(0)
    const [bestRolls, setBestRolls] = React.useState(JSON.parse(localStorage.getItem("bestRolls")) || Infinity)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue && !tenzies) {
            setTenzies(true)
            if ((time[0] < bestTime[0]) || time.slice(1) < bestTime.slice(1)) {
                const bestTime = JSON.stringify(time)
                localStorage.setItem("bestTime", bestTime)
                setBestTime(time)
            }
            if (rolls < bestRolls) {
                const bestRolls = JSON.stringify(rolls)
                localStorage.setItem("bestRolls", bestRolls)
                setBestRolls(bestRolls)
            }
        }
        else if (allHeld && allSameValue && tenzies) {
            setDice(allNewDice())
            setTenzies(false)
            setTime([0, 0])
            setRolls(0)
            setBestTime(JSON.parse(localStorage.getItem("bestTime")))
            setBestRolls(JSON.parse(localStorage.getItem("bestRolls")))
        }
        else {
        }
    }, [dice])

    React.useEffect(() => {
        if (tenzies)
            return

        const intervalId = window.setInterval(() => {
            setTime(prevTime => {
                let timeTmp = []
                if ((prevTime[1] + 1) === 60) {
                    timeTmp[0] = prevTime[0] + 1
                    timeTmp[1] = 0
                }
                else {
                    timeTmp[1] = prevTime[1] + 1
                    timeTmp[0] = prevTime[0]
                }
                return timeTmp;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [tenzies]);

    function generateNewDie() {
        const face = Math.ceil(Math.random() * 6)
        let logo
        if (face === 1) {
            logo = diceFaceOne
        } else if (face === 2) {
            logo = diceFaceTwo
        }
        else if (face === 3) {
            logo = diceFaceThree
        }
        else if (face === 4) {
            logo = diceFaceFour
        }
        else if (face === 5) {
            logo = diceFaceFive
        }
        else {
            logo = diceFaceSix
        }

        return {
            value: face,
            isHeld: false,
            id: nanoid(),
            icon: logo
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ?
                die :
                generateNewDie()
        }))
        setRolls(prevRolls => prevRolls + 1)
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            const isHeld = !die.isHeld
            const face = die.value
            let logo
            if (face === 1 && isHeld) {
                logo = diceFaceOneFilled
            } else if (face === 2 && isHeld) {
                logo = diceFaceTwoFilled
            }
            else if (face === 3 && isHeld) {
                logo = diceFaceThreeFilled
            }
            else if (face === 4 && isHeld) {
                logo = diceFaceFourFilled
            }
            else if (face === 5 && isHeld) {
                logo = diceFaceFiveFilled
            }
            else if (face === 6 && isHeld) {
                logo = diceFaceSixFilled
            }
            else if (face === 1) {
                logo = diceFaceOne
            } else if (face === 2) {
                logo = diceFaceTwo
            }
            else if (face === 3) {
                logo = diceFaceThree
            }
            else if (face === 4) {
                logo = diceFaceFour
            }
            else if (face === 5) {
                logo = diceFaceFive
            }
            else {
                logo = diceFaceSix
            }

            return die.id === id ?
                {
                    ...die,
                    isHeld: isHeld,
                    icon: logo 
                } :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            icon={die.icon}
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <img src={dieLogo} className="backgroundLogo" alt="diceLogo"/>
            <img src={dieLogo} className="backgroundLogoTwo" alt="diceLogo" />
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="info-container">
                <div className="previousTime">
                    <span><strong>Best Time: </strong>{
                        typeof bestTime[0] === 'number' ?
                            (bestTime[0] + ":" + bestTime[1]) :
                            bestTime
                    }</span>
                    <p><strong>Best Rolls: </strong>{
                        bestRolls === Infinity ? "none" : bestRolls
                    }</p>
                </div>
                <button className="roll-dice" onClick={rollDice}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <div className="currentTime">
                    <span><strong>Current Time: </strong>{time[0]}:{time[1]}</span>
                    <p><strong>Current Rolls: </strong>{rolls}</p>
                </div>
            </div>
        </main>
    )

}