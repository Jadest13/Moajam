export type ScoreNote = {
  id: string;
  pitch: number;
  beats: number;
  rest: boolean;
  part: string;
  chord: string;
  lyric: string;
  accent: boolean;
};
export type Score = {
  title: string;
  bpm: number;
  notes: ScoreNote[];
  parts: string[];
  sync: Record<string, number>;
};
export const pitchName = (pitch: number) =>
  ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'][pitch % 12] +
  (Math.floor(pitch / 12) - 1);
const escape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Quarter-note divisions are 4; split notes at 4/4 bar lines and tie pitched fragments.
export function scoreToMusicXml(score: Score): string {
  const parts = score.parts
    .map(
      (name, i) => `<score-part id="P${i + 1}"><part-name>${escape(name)}</part-name></score-part>`,
    )
    .join('');
  const bodies = score.parts
    .map((name, i) => {
      const measures: string[] = [];
      let contents = '';
      let used = 0;
      const finish = () => {
        measures.push(contents);
        contents = '';
        used = 0;
      };
      for (const note of score.notes.filter((item) => item.part === name)) {
        if (
          !Number.isFinite(note.beats) ||
          note.beats <= 0 ||
          note.beats > 64 ||
          !Number.isInteger(note.pitch) ||
          note.pitch < 0 ||
          note.pitch > 127
        )
          throw new Error('음표의 음정과 길이를 확인해주세요.');
        let remaining = Math.round(note.beats * 4);
        let continued = false;
        while (remaining > 0) {
          const duration = Math.min(16 - used, remaining);
          remaining -= duration;
          const ties = note.rest
            ? ''
            : `${continued ? '<tie type="stop"/>' : ''}${remaining ? '<tie type="start"/>' : ''}`;
          const notation = `${!note.rest && continued ? '<tied type="stop"/>' : ''}${!note.rest && remaining ? '<tied type="start"/>' : ''}${note.accent && !continued ? '<articulations><accent/></articulations>' : ''}`;
          if (note.chord && !continued)
            contents += `<direction><direction-type><words>${escape(note.chord)}</words></direction-type></direction>`;
          const pitch = pitchName(note.pitch);
          contents += `<note>${note.rest ? '<rest/>' : `<pitch><step>${pitch[0]}</step>${pitch.includes('♯') ? '<alter>1</alter>' : ''}<octave>${Math.floor(note.pitch / 12) - 1}</octave></pitch>`}<duration>${duration}</duration>${ties}${notation ? `<notations>${notation}</notations>` : ''}${note.lyric && !continued ? `<lyric><text>${escape(note.lyric)}</text></lyric>` : ''}</note>`;
          used += duration;
          continued = true;
          if (used === 16) finish();
        }
      }
      if (used || !measures.length) {
        if (used < 16) contents += `<note><rest/><duration>${16 - used}</duration></note>`;
        finish();
      }
      return `<part id="P${i + 1}">${measures.map((measure, index) => `<measure number="${index + 1}">${index === 0 ? `<attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><direction><sound tempo="${score.bpm}"/></direction>` : ''}${measure}</measure>`).join('')}</part>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><work><work-title>${escape(score.title)}</work-title></work><part-list>${parts}</part-list>${bodies}</score-partwise>`;
}
