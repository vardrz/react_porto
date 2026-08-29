# Trigger deploy dari GAS (opsional, instant)

Pas ada artikel baru di Google Sheets, biar deploy langsung tanpa tunggu cron jam-an.

Di Apps Script editor (Extensions > Apps Script), tambah function + trigger:

```js
// panggil setelah append artikel
function triggerDeploy() {
  const PAT = PropertiesService.getScriptProperties().getProperty('GH_PAT'); // set di Project Properties
  const url = 'https://api.github.com/repos/vardrz/react_porto/dispatches';
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      Authorization: 'token ' + PAT,
      Accept: 'application/vnd.github+json'
    },
    contentType: 'application/json',
    payload: JSON.stringify({ event_type: 'new-article' })
  });
}
```

Trigger: Edit > Triggers > Add trigger -> `triggerDeploy` -> Event `On form submit` / `On change` sesuai sheet.

Alternatif tanpa PAT: cukup andalkan `schedule` cron tiap jam, artikel baru ke-index max 1 jam tanpa webhook.
