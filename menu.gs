function addCalculatorMenu() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Manage Calculator')
      .addItem('Update Rankings', 'updateElo')
      .addItem('Clear Data Page', 'clearData')
      .addToUi();
}
