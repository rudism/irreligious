# irreligio.us

An incremental game in which you start a cult and must grow it into the dominant world religion.

## Current State

Playable, but lightyears from complete and not very pretty or fun yet.

## Play Online

[https://irreligio.us/](https://irreligio.us)

The online version may be behind what's in the repository.

## Build and Run Locally

```
npm install
npm run build
firefox public/index.html
```

## Development Philosophy

- Keep it client-side&mdash;it runs in a web browser, even offline.
- Keep it lean&mdash;no third-party libraries of any kind.
- Keep it clean with strict typescript rules and linting.
- Compile to a single file&mdash;no module loaders or other fancy schmancy nonsense of that sort.
