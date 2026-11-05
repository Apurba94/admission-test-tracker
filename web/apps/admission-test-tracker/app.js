/* Admission Test Tracker: GRE and TOEFL requirements, deadlines and score sending for every program. */
(function () {
  'use strict';
  const KEY = 'admission-test-tracker.programs';
  const COLS = [['program', 'Program', 'text', '22ch'], ['university', 'University', 'text', '18ch'], ['deadline', 'Deadline', 'date'], ['gre', 'GRE', 'select', ['Required', 'Optional', 'Not considered', 'Unknown']], ['greMin', 'GRE note', 'text', '14ch'], ['toefl', 'TOEFL minimum', 'text', '10ch'], ['code', 'Score code', 'text', '8ch'], ['sent', 'Scores sent', 'select', ['Not yet', 'GRE sent', 'TOEFL sent', 'Both sent', 'Not needed']]];
  // Days left to each deadline, soonest first, with programs whose scores are still unsent flagged.
  const agenda = (rows, today) => rows.filter((r) => r.deadline).map((r) => Object.assign({}, r, { days: SK.daysBetween(today, r.deadline), urgent: !/sent|needed/i.test(r.sent || '') && SK.daysBetween(today, r.deadline) <= 21 })).sort((a, b) => a.days - b.days);
  const csv = (rows) => [COLS.map((c) => c[1])].concat(rows.map((r) => COLS.map((c) => r[c[0]] || ''))).map((line) => line.map((v) => { v = String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\n');
  const App = {
    about: 'Applying to several programs means juggling deadlines, GRE policies (required, optional or not considered), TOEFL minimums and score sending. Keep one table of every program, sorted by deadline, with a warning when a deadline is close and scores are not yet sent. Export it as a spreadsheet file.',
    how: ['Add each program in **Programs**, copying requirements from the program\'s own website.', 'Mark scores as sent when you send them.', 'Check **Deadlines** each week. Red rows are within three weeks with scores unsent.', 'Save a spreadsheet copy with **Export CSV**.'],
    tabs: [
      { id: 'programs', label: 'Programs', render(el) {
        const rows = SK.store.get(KEY, []);
        const inp = {};
        const form = SK.h('div', { class: 'sk-row' }, COLS.map(([k, label, type, extra]) => SK.field(label, (inp[k] = type === 'select' ? SK.h('select', {}, extra.map((o) => SK.h('option', { value: o }, o))) : SK.h('input', { type, style: { width: extra || 'auto' } })))));
        const msg = SK.h('div', {});
        el.appendChild(SK.card('Add a program', form, SK.h('div', { style: { marginTop: '10px' } }, SK.btn('Add program', () => {
          const r = {}; COLS.forEach(([k]) => { r[k] = inp[k].value.trim(); });
          if (!r.program) { SK.clear(msg).appendChild(SK.note('Enter the program name.', 'wrong')); return; }
          rows.push(r); SK.store.set(KEY, rows); SK.show('programs');
        }), ' ', SK.btn('Export CSV', () => SK.download('programs.csv', csv(rows), 'text/csv'), 'ghost')), msg));
        el.appendChild(SK.card('Your programs (' + rows.length + ')', rows.length ? SK.table(COLS.map((c) => c[1]).concat(['']), rows.map((r, i) => COLS.map(([k, , type, extra]) => (type === 'select' ? SK.select(extra, r[k], (v) => { rows[i][k] = v; SK.store.set(KEY, rows); }, null) : r[k] || '')).concat([SK.confirmTwice(SK.btn('Remove', null, 'ghost small'), 'Remove', () => { rows.splice(i, 1); SK.store.set(KEY, rows); SK.show('programs'); })]))) : SK.h('p', { class: 'sk-muted', text: 'No programs yet.' })));
      } },
      { id: 'deadlines', label: 'Deadlines', render(el) {
        const a = agenda(SK.store.get(KEY, []), SK.dayKey());
        el.appendChild(SK.card('Coming up', a.length ? SK.table(['Days left', 'Program', 'Deadline', 'Scores'], a.map((r) => [SK.h('strong', { text: r.days < 0 ? 'passed' : String(r.days), style: r.urgent ? { color: 'var(--bad)' } : {} }), r.program + (r.university ? ', ' + r.university : ''), r.deadline, r.sent || 'Not yet'])) : SK.h('p', { class: 'sk-muted', text: 'Add programs with deadlines to see them here.' })));
      } },
    ],
    agenda, csv,
    checks: {
      'deadlines sort soonest first and unsent close ones are urgent': (data, assert) => {
        const a = agenda([{ program: 'B', deadline: '2026-12-20', sent: 'Not yet' }, { program: 'A', deadline: '2026-12-01', sent: 'Not yet' }, { program: 'C', deadline: '2026-12-02', sent: 'Both sent' }, { program: 'D' }], '2026-11-20');
        assert.deepEqual(a.map((r) => r.program), ['A', 'C', 'B']);
        assert.deepEqual(a.map((r) => r.urgent), [true, false, false]);
      },
      'CSV export quotes commas and defuses formulas': (data, assert) => {
        const out = csv([{ program: 'Data Science, MS', toefl: '=1+1' }]);
        assert.ok(out.includes('"Data Science, MS"')); assert.ok(out.includes("'=1+1"));
      },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
