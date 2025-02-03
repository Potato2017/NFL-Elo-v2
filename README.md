# NFL Elo v2

This is the Apps Script code for a Google Sheets spreadsheet that makes an attempt at predicting the outcomes of NFL games. You can see it in action [here](https://docs.google.com/spreadsheets/d/1XkzJc0koOByPUJDbeps7lsUg2qVHwPLhxpbEhtupyH0/edit?usp=sharing). The sheet was 61% accurate over the 2023-2024 season, and has been 67% accurate over the 2024-2025 season up to 2/2/2025.

The main sheet contains each team's offensive, defensive, and overall rating, as well as a record of how correctly the sheet has predicted the games starting from the 2023-2024 season. There is also a win probability calculator and a game search function.

To change the prediction calculation, make a copy of the sheet. The config sheet contains various parameters that can be tweaked to change the predictions. Go to Apps Script under Extensions, click on triggers, and create a trigger that runs the addCalculatorMenu function on open. Refresh the sheet, and click Update Rankings under the new Manage Calculator tab, and the new ratings and predictions will be calculated.
