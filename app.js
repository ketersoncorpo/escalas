const notesEnglish = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesLatin = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

const tunings = {
  bass: {
    "Afinación estándar": ["E", "A", "D", "G"],
    "Drop B": ["B", "F#", "B", "E"],
    "5 cuerdas": ["B", "E", "A", "D", "G"]
  },
  guitar: {
    "Afinación estándar": ["E", "A", "D", "G", "B", "E"],
    "Drop D": ["D", "A", "D", "G", "B", "E"],
    "Afinación abierta G": ["D", "G", "D", "G", "B", "D"]
  }
};

const scales = {
  mayor: [0, 2, 4, 5, 7, 9, 11],
  menor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicaMayor: [0, 2, 4, 7, 9],
  pentatonicaMenor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  dorico: [0, 2, 3, 5, 7, 9, 10],
  frigio: [0, 1, 3, 5, 7, 8, 10],
  lidio: [0, 2, 4, 6, 7, 9, 11],
  mixolidio: [0, 2, 4, 5, 7, 9, 10],
  locrio: [0, 1, 3, 5, 6, 8, 10]
};

const degreeNames = ["1ra", "2da", "3ra", "4ta", "5ta", "6ta", "7ma"];
const board = document.getElementById("fretboard");
const numFrets = 13;

function getNoteName(index, notation) {
  const notes = notation === "latin" ? notesLatin : notesEnglish;
  return notes[index % 12];
}

function populateSelects() {
  const root = document.getElementById("root");
  const scale = document.getElementById("scale");
  const tuning = document.getElementById("tuning");

  notesEnglish.forEach((note, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = note;
    root.appendChild(opt);
  });

  for (let name in scales) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    scale.appendChild(opt);
  }

  updateTunings();
}

function updateTunings() {
  const instrument = document.getElementById("instrument").value;
  const tuning = document.getElementById("tuning");
  tuning.innerHTML = "";
  Object.keys(tunings[instrument]).forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    tuning.appendChild(opt);
  });
}

document.getElementById("instrument").addEventListener("change", () => {
  updateTunings();
});

document.getElementById("showButton").addEventListener("click", displayScale);

function displayScale() {
  const instrument = document.getElementById("instrument").value;
  const tuningType = document.getElementById("tuning").value;
  const tuning = tunings[instrument][tuningType];
  const root = parseInt(document.getElementById("root").value);
  const scaleType = document.getElementById("scale").value;
  const scaleIntervals = scales[scaleType];
  const notation = document.getElementById("notation").value;
  const relative = document.getElementById("relative").value;
  const showDegrees = document.getElementById("showDegrees").checked;

  let rootIndex = root;

  if (relative === "minor" && scaleType === "mayor") {
    rootIndex = (root + 9) % 12;
  } else if (relative === "major" && scaleType === "menor") {
    rootIndex = (root + 3) % 12;
  }

  const scaleNotes = scaleIntervals.map(i => (i + rootIndex) % 12);

  const existingFretNumbers = document.getElementById('fret-numbers');
  const existingMarkers = document.getElementById('marker-row');
  if (existingFretNumbers) existingFretNumbers.remove();
  if (existingMarkers) existingMarkers.remove();

  board.innerHTML = '';

  // Números de trastes
  const fretNumbersRow = document.createElement('div');
  fretNumbersRow.id = 'fret-numbers';
  fretNumbersRow.style.display = 'grid';
  fretNumbersRow.style.gridTemplateColumns = `repeat(${numFrets}, 60px)`;
  fretNumbersRow.style.marginBottom = '4px';
  for (let i = 0; i < numFrets; i++) {
    const numberCell = document.createElement('div');
    numberCell.style.textAlign = 'center';
    numberCell.style.fontSize = '12px';
    numberCell.style.padding = '2px';
    numberCell.textContent = i;
    fretNumbersRow.appendChild(numberCell);
  }
  board.parentElement.insertBefore(fretNumbersRow, board);

  // Cuerdas
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    const stringRow = document.createElement('div');
    stringRow.classList.add('string');

    const openNoteIndex = notesEnglish.indexOf(tuning[stringIndex]);

    for (let fret = 0; fret < numFrets; fret++) {
      const noteIndex = (openNoteIndex + fret) % 12;
      const note = document.createElement('div');
      note.classList.add('fret');

      if (scaleNotes.includes(noteIndex)) {
        const name = getNoteName(noteIndex, notation);
        const degree = scaleIntervals.indexOf((noteIndex - rootIndex + 12) % 12);
        note.textContent = showDegrees && degree >= 0 ? degreeNames[degree] : name;
        note.classList.add("highlight");
      } else {
        note.textContent = "";
      }

      stringRow.appendChild(note);
    }

    board.appendChild(stringRow);
  }

  // Puntos de posición
  const markerPositions = [3, 5, 7, 9, 12];
  const markerRow = document.createElement('div');
  markerRow.id = 'marker-row';
  markerRow.style.display = 'grid';
  markerRow.style.gridTemplateColumns = `repeat(${numFrets}, 60px)`;
  markerRow.style.marginTop = '4px';

  for (let i = 0; i < numFrets; i++) {
    const marker = document.createElement('div');
    marker.style.textAlign = 'center';
    if (markerPositions.includes(i)) {
      marker.textContent = i === 12 ? '●●' : '●';
    } else {
      marker.textContent = '';
    }
    markerRow.appendChild(marker);
  }

  board.parentElement.appendChild(markerRow);
}

// Mostrar algo al iniciar
window.addEventListener("DOMContentLoaded", () => {
  populateSelects();
  document.getElementById('showButton').click();
});