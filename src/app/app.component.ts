import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './animate.css']
})

export class AppComponent {
  dictionary: string[] = ["DISFIGUREMENT", "BLISSFULLY", "PRAYER", "ARK", "PENGUIN", "CADAVER", "YOUNG", "HARPOON", "DRUM", "HARLOT", "DINNER", "CHEMICAL", "FORK", "EXAMINER", "PERILOUS", "CODDLE", "PUBLIC", "DIZZY", "HOBBY", "SONG", "GUM", "GOODBYE", "ACCESSORIES", "ETHICAL", "BACKYARD", "JUNKYARD", "SUNRISE", "CAPTAIN", "EXPLICIT", "HAYWIRE", "BLADE", "EAR", "GHETTO", "ELASTIC", "ALPHABET", "BLOWGUN", "SMUT", "PLASMA", "DOBERMAN", "CODDLE", "VISION", "DECADENCE", "WASP", "EMOTION", "CASKET", "HANGMAN", "DECAPITATION", "HERB", "BIZARRE", "VIBRATION", "EMPTY", "FERTILITY", "CHAMBER", "BRILLIANT", "FIERY", "BAKE", "ADULT", "FINANCIAL", "FORNICATOR", "ARSONIST", "ABSORB", "CRIMSON", "LUCKY", "POSSESSION", "SHARK", "DISK", "FILTER", "MOLTEN", "AUTOPILOT", "CATTLE", "FURRY", "EXPLICIT", "CONDEMNED", "HORRIFIC", "HOTHEAD", "HOOPLA", "PLAYTIME", "BLEEDER", "COAL", "FIEND", "CHISEL", "FOUL", "FLIP", "EXPLICIT", "FEEL", "FLUCTUATION", "MURDERER", "FOG", "GRIM", "POUND", "WINTER", "PROPELLER", "FLUCTUATION", "DIABOLATRY", "DEGENERATE", "JUICE", "BLOSSOM", "FREEDOM", "GLUTTON", "DOME", "TASTE", "VISITOR", "FIGHT", "KINGDOM", "IMPURE", "CHILDISH", "ART", "ADHESIVE", "TRAUMA", "MASTER", "GIANT", "PRANK", "BIGGEST", "CONTAGIOUS", "DISCIPLINE", "BLUBBER", "COMFORTABLE", "ACROBATIC", "OPPOSITION", "CRABS", "BALLET", "HIT", "BLEAK", "AGAINST", "CLOCK", "WAKE", "VICTORY", "CELLBLOCK", "DECADENT", "DIAMOND", "SALT", "BUCKET", "ACTOR", "ACOUSTIC", "HUGE", "HARMONY", "GEOMETRY", "YOUNG", "CONFUSED", "BEGGING", "BARNYARD", "AIM", "GREASY", "LOGIC", "PURPOSE", "INDECENT", "FRECKLED", "DITCH", "PUZZLE", "BUFFET", "SHOCK", "BLESSING", "FILTER", "RUBY", "BARBER", "BLINKS", "LIMITLESS", "AMBER", "FLUTTER", "DOWNFALL", "AVAILABLE", "CATHEDRAL", "BUTCHER", "HONEYMOON", "CINNAMON", "MARGINAL", "SCAR", "HABIT", "AIRTIGHT", "DIRECTOR", "THINK", "QUICK", "HEARTBEAT", "TANK", "ANATOMY", "CHRONOLOGICAL", "GENERATION", "ALPHABETIC", "MOIST", "BRUTE", "BRASS", "GANGLAND", "ALSO", "SOUP", "AGENDA", "AMERICANA", "CREATION", "FINCH", "COMPULSION", "ABANDON", "BEARD", "FAST", "STEEL", "BACKWARD", "FIRE", "CLUB", "JUSTICE", "BEATEN", "JUNIOR", "HEART", "GADGET", "ARTIFICIAL", "POCKET", "FAITH", "COMPLETE", "HABIT", "TRAUMA", "SERENITY", "ALLIGATOR", "CONCEPTUAL", "BIOLOGICAL", "CREW", "HUNCHBACK", "ASTOUNDING", "CORROSIVE", "HIDE", "GANGLAND", "COMPOUND", "ATTEMPT", "CHARM", "REBEL", "HELMET", "BED", "GLASS", "LICKER", "HOP", "FORTUNE", "CONSPIRACY", "BANK", "BIONIC", "BRIBERY", "NARCOTIC", "TREASURE", "NINETEEN", "COMPLICATED", "DREAM", "AMBITION", "ENLARGE", "LUST", "ARK", "BUMBLE", "DAREDEVIL", "PROCESS", "PARALYSIS", "KIND", "BETWEEN", "ANKH", "LOCUST", "CONSUMPTION", "GINGER", "HACK", "BAKE", "BARBERSHOP", "BINGE", "DANCER", "IMAGINARY"];
  title = 'repo';
  typingpad: string;
  oldtypingpad: string = "";

  bombs: bomb[];
  score = 0;
  tickRate = 0.1;
  tickRateDisplay = 0.1;
  gameover = false;
  adjacents = [[], [], [], [4, 6], [3, 5, 7], [4, 8], [3, 7, 9], [4, 6, 8, 10], [5, 7, 11], [6, 10], [9, 7, 11], [10, 8]];
  log: logWord[];
  bombTicker: Observable<number>;
  bombGuiFaller: Observable<number>;
  inputGrabber: Observable<number>;
  game_active: boolean = false;

  constructor(private matSnackBar: MatSnackBar) { };

  ngOnInit(): void {
    this.log = [];
    this.bombs = [];
    for (let index = 0; index < 12; index++) {
      this.bombs.push(this.generateBomb());
    }
    this.bombTicker = interval(100);
    this.bombGuiFaller = interval(10);
    this.inputGrabber = interval(10);
    // Subscribe to begin ticking bombs
    this.bombTicker.subscribe(n =>
      this.tickDown());
      this.bombGuiFaller.subscribe(n =>
        this.guiFall());
    this.inputGrabber.subscribe(n =>
      this.typingUpdate());
  }



  tickDown(): void {
    if (!this.game_active) return;
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index]) {
        if (this.bombs[index].newtime >= 0) this.bombs[index].newtime -= 0.5;
        this.bombs[index].time -= this.tickRate;
        this.bombs[index].timedisplay = Math.round(this.bombs[index].time);

        if (this.bombs[index].time <= 0) {
          this.stop();
          return;
        }
      }
    }
    this.tickRate += 0.0002;
    this.tickRateDisplay = Math.round(this.tickRate / 0.1 * 10) / 10.0;
  }

  guiFall(): void {
    if (!this.game_active) return;
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index]) {
        if (this.bombs[index].offsetY >= 0) this.bombs[index].offsetY -= 5;
      }
    }
    for (let index = 0; index < this.bombs.length; index++) {
      if (this.bombs[index]) {
        if (this.bombs[index].newtime >= 0) this.bombs[index].newtime -= 0.05;
      }
    }

  }

  stop() {
    this.gameover = true;
    this.game_active = false;
  }

  restart() {
    this.tickRate = 0.1;
    this.tickRateDisplay = Math.round(this.tickRate / 0.1 * 10) / 10.0;
    this.typingpad = "";
    this.score = 0;
    this.log = [];
    for (let index = 0; index < 12; index++) {
      this.bombs[index] = this.generateBomb();
    }
    this.game_active = true;
    this.gameover = false;
  }

  moveDown(): void {
    var change = false;
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index] == null) {
        this.bombs[index] = this.bombs[index - 3];
        this.bombs[index].offsetY += 200;
        this.bombs[index - 3] = null;
        change = true;
      }
    }

    for (let index = 0; index < 3; index++) {
      if (this.bombs[index] == null) {
        this.bombs[index] = this.generateBomb();
        change = true;
      }
    }
    if (change) this.moveDown();
  }

  generateBomb(): bomb {
    var words = this.dictionary;
    for (let index = 0; index < this.bombs.length; index++) {
      if (this.bombs[index] && words.includes(this.bombs[index].word)) {
        words.splice(words.indexOf(this.bombs[index].word), 1);
      }
    }
    var time = 10 * this.tickRateDisplay + Math.floor(10 * Math.random());
    var newBomb: bomb = {
      word: words[Math.floor(Math.random() * (words.length - 1))],
      prefix: "",
      timedisplay: time,
      suffix: "",
      time: time,
      color: ["red", "blue", "green"][Math.floor(2.9999 * Math.random())],
      newtime: 2,
      offsetY: 0
    }
    newBomb.suffix = newBomb.word;
    return newBomb;
  }

  typingUpdate() {
    if (!this.game_active) return;
    if (this.oldtypingpad.length > this.typingpad.length) {
      this.typingpad = "";
    }
    var noPrefix = true;
    try {

      for (let index = 3; index < this.bombs.length; index++) {
        if (this.bombs[index].word.startsWith(this.typingpad.toUpperCase())) {
          this.bombs[index].prefix = this.typingpad;
          this.bombs[index].suffix = this.bombs[index].word.substr(this.typingpad.length);
          noPrefix = false;
        }
        else {
          this.bombs[index].prefix = "";
          this.bombs[index].suffix = this.bombs[index].word;
        }

        if (this.bombs[index]) {
          if (this.bombs[index].word.toUpperCase() == this.typingpad.toUpperCase()) {
            this.typingpad = "";
            this.blowUp(index);
          }
        }
      }
    }
    finally {
      this.oldtypingpad = this.typingpad;
    }
    if (noPrefix) {
      this.typingpad = "";
    }
  }

  addToLog(word: logWord) {
    this.log = [word].concat(this.log);
  }

  blowUp(index: number) {
    var word = this.bombs[index].word;
    var color = this.bombs[index].color;
    var adjacents = this.adjacents[index];
    var scoreAdded = Math.round(this.bombs[index].time);
    var timeAdded = 0;
    this.bombs[index] = null;
    for (let j = 0; j < adjacents.length; j++) {

      if (this.bombs[adjacents[j]] != null && this.bombs[adjacents[j]].color == color) {
        scoreAdded += 10 + Math.round(this.bombs[adjacents[j]].time);
        this.bombs[adjacents[j]] = null;
        adjacents = adjacents.concat(this.adjacents[adjacents[j]]);
        timeAdded += 4;
      }
    }
    for (let j = 0; j < 12; j++) {
      if (this.bombs[j])
        this.bombs[j].time += timeAdded;
    }
    this.score += scoreAdded;
    this.moveDown();

    this.addToLog({
      word: word,
      score: scoreAdded
    })
  }
}

interface logWord {
  word: string,
  score: number,
}

interface bomb {
  newtime: number,
  timedisplay: number,
  word: string,
  prefix: string,
  suffix: string,
  time: number,
  color: string,
  offsetY: number
}