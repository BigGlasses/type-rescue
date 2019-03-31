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
  gameover = false;
  adjacents = [[], [], [], [4, 6], [3, 5, 7], [4, 8], [3, 7], [4, 6, 8], [5, 7]];
  lock = 0;
  log: logWord[];
  bombTicker: Observable<number>;
  sub : Subscription;

  constructor(private matSnackBar: MatSnackBar) { };

  ngOnInit(): void {
    this.log = [];
    this.bombs = [];
    for (let index = 0; index < 9; index++) {
      this.bombs.push(this.generateBomb());
    }
    this.bombTicker = interval(1000);
    // Subscribe to begin publishing values
    this.sub = this.bombTicker.subscribe(n =>
      this.tickDown());
  }



  tickDown(): void {
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index]) {
        this.bombs[index].time -= 1;
        if (this.bombs[index].time == 0) {
          this.stop();
          return;
        }
      }
    }
  }

  stop() {
    // this.matSnackBar.open('Finish score: ' + this.score, 'close', { duration: 5000 });
    this.sub.unsubscribe();
    this.gameover = true;
  }

  restart() {
    this.score = 0;
    this.log = [];
    for (let index = 0; index < 9; index++) {
      this.bombs[index] = this.generateBomb();
    }
    this.sub = this.bombTicker.subscribe(n =>
      this.tickDown());
    this.gameover = false;
  }

  moveDown(): void {
    var change = false;
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index] == null) {
        this.bombs[index] = this.bombs[index - 3];
        this.bombs[index - 3] = null;
        change = true;
      }
    }

    for (let index = 0; index < 9; index++) {
      if (this.bombs[index] == null) {
        this.bombs[index] = this.generateBomb();
        change = true;
      }
    }
    console.log(this.bombs, change);
    if (change) this.moveDown();
  }

  generateBomb(): bomb {
    var newBomb: bomb = {
      word: this.dictionary[Math.floor(Math.random() * 255)],
      time: 10 + Math.floor(10 * Math.random()),
      color: ["red", "blue", "green"][Math.floor(2.9999 * Math.random())],
    }
    return newBomb;
  }

  typingUpdate() {
    while (this.lock == 1) 1;
    if (this.oldtypingpad.length > this.typingpad.length) {
      this.typingpad = "";
    }
    this.lock = 1;
    for (let index = 3; index < this.bombs.length; index++) {
      if (this.bombs[index]) {
        if (this.bombs[index].word.toUpperCase() == this.typingpad.toUpperCase()) {
          this.typingpad = "";
          this.blowUp(index);
        }
      }
    }
    this.oldtypingpad = this.typingpad;
    this.lock = 0;
  }

  addToLog(word: logWord) {
    this.log = [word].concat(this.log);
  }

  blowUp(index: number) {
    var word = this.bombs[index].word;
    var color = this.bombs[index].color;
    var adjacents = this.adjacents[index];
    var scoreAdded = this.bombs[index].time;
    var timeAdded = 0;
    this.bombs[index] = null;
    for (let j = 0; j < adjacents.length; j++) {
      if (this.bombs[adjacents[j]] != null && this.bombs[adjacents[j]].color == color) {
        scoreAdded += 10 + this.bombs[adjacents[j]].time;
        this.bombs[this.adjacents[index][j]] = null;
        adjacents = adjacents.concat(this.adjacents[this.adjacents[index][j]]);
        timeAdded += 4;
      }
    }
    for (let j = 0; j < 9; j++) {
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
  word: string,
  prefix: string,
  suffix: string,
  time: number,
  color: string,
  offsetY: number
}