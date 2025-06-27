const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const latinNotes = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
const degreeNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const scales = {
  ionian: { name: "Jónico (Mayor)", intervals: [0, 2, 4, 5, 7, 9, 11] },
  dorian: { name: "Dórico", intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: "Frigio", intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: "Lidio", intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: "Mixolidio", intervals: [0, 2, 4, 5, 7, 9, 10] },
  aeolian: { name: "Eólico (Menor Natural)", intervals: [0, 2, 3, 5, 7, 8, 10] },
  locrian: { name: "Locrio", intervals: [0, 1, 3, 5, 6, 8, 10] },
  harmonicMinor: { name: "Menor Armónica", intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodicMinor: { name: "Menor Melódica", intervals: [0, 2, 3, 5, 7, 9, 11] },
  majorPent: { name: "Pentatónica Mayor", intervals: [0, 2, 4, 7, 9] },
  minorPent: { name: "Pentatónica Menor", intervals: [0, 3, 5, 7, 10] },
  blues: { name: "Escala de Blues", intervals: [0, 3, 5, 6, 7, 10] },
  chromatic: { name: "Cromática", intervals: Array.from({length: 12}, (_, i) => i) }
};

const tunings = {
  guitar: {
    standard: ['E', 'A', 'D', 'G', 'B', 'E'],
    dropD: ['D', 'A', 'D', 'G', 'B', 'E']
  },
  bass: {
    standard: ['E', 'A', 'D', 'G'],
    dropD: ['D', 'A', 'D', 'G'],
    '5string': ['B', 'E', 'A', 'D', 'G']
  }
};

function populateSelectors() {
  const rootSelect = document.getElementById('root');
  const scaleSelect = document.getElementById('scale');

  notes.forEach(note => {
    const opt = document.createElement('option');
    opt.value = note;
    opt.textContent = note;
    rootSelect.appendChild(opt);
  });

  for (const [key, scale] of Object.entries(scales)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = scale.name;
    scaleSelect.appendChild(opt);
  }

  updateTuningOptions();
}

function updateTuningOptions() {
  const instrument = document.getElementById('instrument').value;
  const tuningSelect = document.getElementById('tuning');
  tuningSelect.innerHTML = '';

  for (const [key, strings] of Object.entries(tunings[instrument])) {
    const opt = document.createElement('option');
    opt.value = key;

    let label = '';
    if (key === 'standard') label = 'Afinación estándar';
    else if (key === 'dropD') label = 'Drop D';
    else if (key === '5string') label = '5 cuerdas';

    opt.textContent = `${label} (${strings.join(' ')})`;
    tuningSelect.appendChild(opt);
  }

  const fretboardImage = document.getElementById('fretboard-image');
  fretboardImage.src = instrument === 'guitar' ? 'fretboard-guitar.png' : 'fretboard-bass.png';
}

function getScaleNotes(root, scaleType, relativeType = 'none') {
  let rootIndex = notes.indexOf(root);
  const intervals = scales[scaleType].intervals;

  if (relativeType === 'minor') rootIndex = (rootIndex + 9) % 12;
  else if (relativeType === 'major') rootIndex = (rootIndex + 3) % 12;

  return intervals.map(i => notes[(rootIndex + i) % 12]);
}

function getChordType(interval) {
  switch (interval) {
    case 0: return '';           // I mayor
    case 2: return 'm';          // II menor
    case 4: return 'm';          // III menor
    case 5: return '';           // IV mayor
    case 7: return '';           // V mayor
    case 9: return 'm';          // VI menor
    case 11: return 'dim';       // VII disminuido
    default: return '';
  }
}

function drawFretboard() {
  const instrument = document.getElementById('instrument').value;
  const tuningKey = document.getElementById('tuning').value;
  const root = document.getElementById('root').value;
  const scaleType = document.getElementById('scale').value;
  const relativeType = document.getElementById('relative').value;
  const notation = document.getElementById('notation').value;
  const showDegrees = document.getElementById('showDegrees').checked;
  const showChords = document.getElementById('showChords').checked;

  const scaleNotes = getScaleNotes(root, scaleType, relativeType);
  const tuning = tunings[instrument][tuningKey];
  const board = document.getElementById('fretboard');

  const numStrings = tuning.length;
  const numFrets = 12;

  board.style.gridTemplateRows = `repeat(${numStrings}, 50px)`;
  board.style.gridTemplateColumns = `repeat(${numFrets}, 60px)`;
  
  
  // Eliminar numeración y marcadores si existen
  const existingFretNumbers = document.getElementById('fret-numbers');
  const existingMarkers = document.getElementById('marker-row');
  if (existingFretNumbers) existingFretNumbers.remove();
  if (existingMarkers) existingMarkers.remove();

  board.innerHTML = '';
    

  // Agregar numeración de trastes
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

  // Mostrar acordes como lista clara si está activado
  const chordListDiv = document.getElementById('chord-list');
  chordListDiv.innerHTML = '';

  if (showChords) {
    const list = document.createElement('div');
    list.style.marginTop = '1rem';
    list.innerHTML = '<strong>Acordes por grado:</strong><br>';

    scaleIntervals.forEach((intv, idx) => {
      const note = notes[(rootIndex + intv) % 12];
      const degree = degreeNames[idx] || '';
      const chord = getChordType(intv);
      const name = note + chord;
      list.innerHTML += `${degree}: ${name} &nbsp; `;
    });

    chordListDiv.appendChild(list);
  }

  // Agregar puntos guía
  const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
  const doubleMarkerFrets = [12, 24];

  const markerRow = document.createElement('div');
  markerRow.id = 'marker-row';
  markerRow.style.display = 'grid';
  markerRow.style.gridTemplateColumns = `repeat(${numFrets}, 60px)`;
  markerRow.style.margin = '4px 0';

  for (let i = 0; i < numFrets; i++) {
    const markerCell = document.createElement('div');
    markerCell.style.textAlign = 'center';
    markerCell.style.fontSize = '14px';
    markerCell.innerHTML = markerFrets.includes(i)
      ? (doubleMarkerFrets.includes(i) ? '••' : '•')
      : '&nbsp;';
    markerRow.appendChild(markerCell);
  }

  board.parentElement.insertBefore(markerRow, board);
    

  const rootIndex = notes.indexOf(root);
  const scaleIntervals = scales[scaleType].intervals;
  const degreesMap = new Map();

  scaleIntervals.forEach((intv, idx) => {
    const noteName = notes[(rootIndex + intv) % 12];
    const degreeLabel = degreeNames[idx] || '';
    const chordType = getChordType(intv);
    degreesMap.set(noteName, { degree: degreeLabel, chord: noteName + chordType });
  });

  [...tuning].reverse().forEach(openNote => {
    const openIndex = notes.indexOf(openNote);
    for (let fret = 0; fret < numFrets; fret++) {
      const note = notes[(openIndex + fret) % 12];
      const isInScale = scaleNotes.includes(note);
      const isRoot = note === (relativeType !== 'none' ? scaleNotes[0] : root);

      const cell = document.createElement('div');
      cell.classList.add('fret');

      if (isInScale) {
        const noteEl = document.createElement('div');
        noteEl.className = 'note' + (isRoot ? ' root' : '');

        const noteIndex = notes.indexOf(note);
        let display = notation === 'latin' && noteIndex !== -1 ? latinNotes[noteIndex] : note;

        if (showDegrees && degreesMap.has(note)) {
          display = degreesMap.get(note).degree;
        } else if (showChords && degreesMap.has(note)) {
          display = degreesMap.get(note).chord;
        }

        noteEl.textContent = display;
        cell.appendChild(noteEl);
      }

      board.appendChild(cell);
    }
  });
}

document.getElementById('instrument').addEventListener('change', () => {
  updateTuningOptions();
  drawFretboard();
});

document.getElementById('showButton').addEventListener('click', drawFretboard);
window.addEventListener('DOMContentLoaded', () => {
  populateSelectors();
  drawFretboard();
});