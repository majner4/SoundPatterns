import React, { Component } from 'react';
import Sound from 'react-sound';
import './Game.css';
import './helpers.css';
import {select_sound} from './helpers.js';
import Timer from './Timer.js';

import sounds from './sounds.js';

var FontAwesome = require('react-fontawesome');


const SECONDS = 60;

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            // is game on?
            playing: false,

            // time
            seconds: SECONDS,
            timerRun: false,

            // voices
            voices: true,

            // sounds
            sounds: true,
            soundStatus: 'stop',
            soundName: '',

            randomSounds: [],

            keyPressed: [],

            display: true,

            // score
            score: 0
        };

        this.turnVoices = this.turnVoices.bind(this);
        this.turnSound = this.turnSound.bind(this);

        this.controlDisplay = this.controlDisplay.bind(this);

        this.setTime = this.setTime.bind(this);

        // handle time update from timer
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);

        // handle keys
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // new game function
        this.newGame = this.newGame.bind(this);

        this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
    }

    componentDidMount() {
        this.newGame();

        // add key listener
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        // remove key listener
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    // turn voices off/on
    turnVoices() {
        this.setState({
            voices: !this.state.voices
        }, () => !this.state.voices ? window.responsiveVoice.cancel() : window.responsiveVoice.speak(" ", "Czech Female"));

        this.buttonVoices.blur();
    }

    // turn sounds off/on
    turnSound() {
        this.setState({
            sounds: !this.state.sounds
        });       

        this.buttonSounds.blur();
    }

    // display controls - blind mode
    controlDisplay() {
        this.setState({
            display: !this.state.display
        });

        this.buttonDisplay.blur();
    }

    // timer update - to (in/de)crease actual time by specified time (seconds)
    setTime(currentTime, sec) {
        if (this.state.playing) {
            if ((currentTime + sec) > 60) {
                return 60;
            } else if ((currentTime - sec) < 0) {
                return 0;
            } else {
                return currentTime + sec;
            }
        } else {
            return 60;
        }
    }

    generateRandomSounds() {
        let track = ['left', 'right', 'top'];
        let color1;
        let color2;
        let playSounds = [];

        let randomSounds = track;
        let randomNumber = Math.floor(Math.random() * randomSounds.length);
        let randomNumber2 = Math.floor(Math.random() * randomSounds.length);
        let generateSound = randomSounds[randomNumber];
        let generateSound2 = randomSounds[randomNumber2];

        playSounds.push(generateSound);
        playSounds.push(generateSound2);

        if (playSounds[0] === 'left') {
            color1 = 'blue';

        }
        if (playSounds[0] === 'right') {
            color1 = 'purple';

        }

        if (playSounds[0] === 'top') {
            color1 = 'orange';

        }

        if (playSounds[1] === 'left') {
            color2 = ' blue';

        }
        if (playSounds[1] === 'right') {
            color2 = ' purple';

        }

        if (playSounds[1] === 'top') {
            color2 = ' orange';

        }


        let colors = [
        ];
        colors.push(color1);
        colors.push(color2);


        this.setState({
            color1: colors[0],
            color2: colors[1],
            randomSounds: playSounds
        });
        return playSounds;
    }


    readRandomSounds () {
        let playSounds = this.generateRandomSounds();

        let audio = new Audio();
        let i = 0;


        if (this.state.sounds) {
            audio.addEventListener('ended', function () {

                i = ++i < playSounds.length ? i : playSounds;

                if (i >= 0) {
                    audio.src = select_sound(sounds, playSounds[i]).url;
                    audio.play();
                } else {
                    audio.pause();
                }
            }, true);

            audio.volume = 0.7;
            audio.loop = false;
            audio.src = select_sound(sounds, playSounds[i]).url;
            audio.play();
        } else {
            audio.pause();
        }
    }

    correctSoundsWithKeys() {
        let condition= true;
        let soundStatus = 'play';
        let sound1 = this.state.randomSounds[0];
        let sound2 = this.state.randomSounds[1];
        let keyPress1 = this.state.keyPressed[0];
        let keyPress2 = this.state.keyPressed[1];
        let keyPressed = this.state.keyPressed;

        if(keyPress1 === sound1) {
            condition = true;
            if(condition === true){
                if(keyPress2 === sound2) {
                    let newScore = this.state.score + 5;
                    this.setState({
                        soundStatus,
                        soundName: 'success',
                        score: newScore
                    });
                    keyPressed.splice(0, keyPressed.length);
                    this.readRandomSounds();
                } else if(keyPress1 !== sound1 && keyPress2 !== sound2) {
                    if(condition === false) {
                        this.setState({
                            soundStatus,
                            soundName: 'failure',
                            playing: false,
                            timerRun: false
                        });
                        window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
                    }

                }
            }
        } else {
            condition = false;
            if(condition = false) {
                this.setState({
                    soundStatus,
                    soundName: 'failure',
                    playing: false,
                    timerRun: false
                });
                window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
            }
        } return condition;

    }



    // handle keyDown - move player by 'Arrow keys', 'Alt' to read possible directions
    handleKeyDown(e) {
        let keyPressLenght = this.state.keyPressed.length;
        let keyString;
        switch (e.keyCode) {
            case 37:
                keyString = 'left';
                break;

            case 38:
                keyString = 'top';
                break;

            case 39:
                keyString = 'right';
                break;
        }
        this.state.keyPressed.push(keyString);
        if (keyPressLenght === 1) {
            this.correctSoundsWithKeys();
        }



        if (!this.state.playing || !this.state.timerRun) {
            if (e.keyCode === 82) {
                e.preventDefault(); // cancel focus event from turn voices button
                this.newGame();
            } else {
                return;
            }
        }

        switch (e.keyCode) {
            case 82:
                if (e.keyCode === 82) {
                    // refresh
                    e.preventDefault(); // cancel focus event from turn voices button
                    return this.newGame();
                }
                break;

            case 18: // alt
                if (e.keyCode === 18) {
                    e.preventDefault();
                    if (!this.state.voices) return;
                }

                break;
        }
    }

    // handle keyUp
    handleKeyUp(e) {
        if (!this.state.playing) return;
    }

    // handle finish sound playing
    handleFinishedPlaying() {
        this.setState({
            soundStatus: 'stop'
        });
    }

    // init new game
    newGame() {
        window.clearTimeout(this.startGameTimer);
        this.readRandomSounds();

        this.setState({
            playing: false,

            seconds: SECONDS,
            timerRun: false,

            score: 0
        }, () => {

            this.setState({
                playing: true,
                timerRun: true
            });

            this.buttonRefresh.blur();
        });
    }

    // handle time update
    handleTimeUpdate(seconds) {
        this.setState({
            seconds
        });

        if (seconds === 3) {
            this.setState({
                soundStatus: 'play',
                soundName: 'tick',
            });
        } else if (seconds === 0 || seconds < 0) {
            this.setState({
                playing: false,
                timerRun: false
            });
            
            window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
        }
    }

    render() {
        const {
            playing,
            timerRun,
            seconds,
            display,
            sounds: stateSounds,
            voices
        } = this.state;

        let iconVoices = voices ? <FontAwesome name='toggle-on' size='2x' /> : <FontAwesome name='toggle-off' size='2x' />;
        let iconSounds = stateSounds ? <FontAwesome name='volume-up' size='2x' /> : <FontAwesome name='volume-off' size='2x' />;
        let iconDisplay = display ? <FontAwesome name='eye-slash' size='4x' /> : <FontAwesome name='eye' size='4x' />;

        return (
            <div className="Game">
                <header>
                    {/* <h1>ProjectName<span>Easy</span></h1> */}

                    <div className="options">
                        <button onClick={this.newGame} ref={(buttonRefresh) => { this.buttonRefresh = buttonRefresh; }}>
                            <FontAwesome name='refresh' size='2x' />
                        </button>

                        <button onClick={this.turnSound} ref={(buttonSounds) => { this.buttonSounds = buttonSounds; }}>
                            {iconSounds}
                        </button>

                        <button className="speech-btn" onClick={this.turnVoices} ref={(buttonVoices) => { this.buttonVoices = buttonVoices; }}>
                            {iconVoices}
                            <span>číst</span>
                        </button>
                    </div>
                </header>

                <div className={display ? 'SoundChallenge__area' : 'SoundChallenge__area blur'}>

                    {
                        !this.state.display
                            ? <div className="overlay"/>
                            : null
                    }

                    <div className={'circle '+ this.state.color1 + this.state.color2}>

                    </div>

                </div>

                <div className="options options-display">
                    <button onClick={this.controlDisplay} ref={(buttonDisplay) => this.buttonDisplay = buttonDisplay}>
                        {iconDisplay}
                    </button>
                </div>

                {
                    playing && seconds > 0
                    ? <Timer status={timerRun} duration={seconds} timeCallback={this.handleTimeUpdate} />
                    : null
                }

                {
                    !this.state.sounds || this.state.soundStatus !== 'play'
                    ? null
                    : (
                        <Sound
                            url={select_sound(sounds, this.state.soundName).url}
                            playStatus={'PLAYING'}
                            volume={100}
                            onFinishedPlaying={this.handleFinishedPlaying}
                        />
                    )
                }

                <div className="score">
                    {this.state.score}
                    <span> points</span>
                </div>

                <footer>
                    {/* Powered by <a href="http://evalue.cz/">eValue.cz</a> */}
                </footer>
            </div>
        );
    }
}

export default Game;