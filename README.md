# Admission Test Tracker

Track GRE and TOEFL requirements, deadlines and score sending for every program you apply to.

Part of the [GRE and TOEFL Study Suite](https://github.com/Apurba94/gre-toefl-study-suite): 100 free study apps for the GRE and TOEFL and more. It works offline, as a Windows program or in the browser.

## Download and run

- **Windows:** download `Admission Test Tracker.exe` from the [latest release](https://github.com/Apurba94/admission-test-tracker/releases/latest) and open it. Nothing to install. It opens in its own window and saves your progress in your user folder.
- **Browser:** open it online in the suite's web edition at https://gre-toefl-study-suite.vercel.app/apps/admission-test-tracker/ . Progress stays in that browser.
- **From source:** `python launcher.py` (Python 3.10 or later, no packages needed).

## What it does

Applying to several programs means juggling deadlines, GRE policies (required, optional or not considered), TOEFL minimums and score sending. Keep one table of every program, sorted by deadline, with a warning when a deadline is close and scores are not yet sent. Export it as a spreadsheet file.

Sections: Programs, Deadlines, Progress, About.

## How to use it

1. Add each program in **Programs**, copying requirements from the program's own website.
2. Mark scores as sent when you send them.
3. Check **Deadlines** each week. Red rows are within three weeks with scores unsent.
4. Save a spreadsheet copy with **Export CSV**.

## Good to know

- All questions, passages and definitions were written for this suite. None are official ETS questions. For official practice, use the materials on ets.org.
- It follows the GRE General Test as shortened in September 2023 and the TOEFL iBT as updated in January 2026. Formats change, so check ets.org before your test.
- Feedback on writing and speaking counts things a program can count honestly, such as length and linking words. It does not give an official score.
- Not endorsed by or affiliated with ETS. GRE and TOEFL are registered trademarks of ETS.

## For developers

The app is plain HTML and JavaScript in `web/`, run by a small Python launcher that serves it on 127.0.0.1 only and needs a secret token for saving. Tests: `node --test "tests/*.test.js"` (24 tests) and `python -m unittest discover -s tests`. Build the .exe with `python build_exe.py`.

Built with AI assistance (Claude Code). MIT licence. By JANIN A APURBA.
