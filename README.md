# jsblocks.I18n

Simple localization support for elegant jsblocks "Better MV-ish" framework. 

Do not expect much from this extension, use as is or improve and send me a pull request :-)

## Properties:

- Automatically downloads locale files when needed.
- Uses message as translation key. By default it accepts language as English.
- Can replace parameters in message.
- Caches loaded json lang file.
- Uses observables for messages, so dynamically renders new message when language changes.

## Example Usage:

### Include this file

```html
<script type="text/javascript" src="vendor/jsblocks.I18n/jsblocks.I18n.js"></script>
```

### Example locale file: 

`locales/tr.json`:
```json
  {
    "locale": "tr",
    "data": {
      "Song no {no} is playing now.": "Şimdi {no} nolu şarkı çalınıyor."
    }
  }
```

#### Initializing Extension:

```js
  blocks.I18.init({
      lang: 'tr'
  });
```

#### Calling from templates:

```html
  <h1>{{ __('Song no {no} is playing now.', { no: 1 }) }}</h1>
```
#### Calling from JS

```js
  console.log(__('Song no {no} is playing now.', { no: 1 }));
```
