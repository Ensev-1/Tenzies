import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <img
            className="die-face"
            style={styles}
            onClick={props.holdDice}
            alt="die-icon"
            src={props.icon}
        >
        </img>
    )
}