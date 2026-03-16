---
source: Official docs
library: Remotion
package: remotion
topic: player-astro-react-hero
fetched: 2026-03-15T00:00:00Z
official_docs: https://www.remotion.dev/docs/player/player
---

# Remotion Player findings for an Astro + React hero

## Playback end behavior and avoiding reset to frame 0

- `loop` defaults to `false`.
- `moveToBeginningWhenEnded` only applies when `loop` is disabled and defaults to `true`.
- To prevent the player from jumping back to frame `0` at the end, set `moveToBeginningWhenEnded={false}`.
- `ended` fires when playback reaches the end and looping is disabled.
- `pause` also fires when the video ends.
- If you want an extra safeguard, listen for `ended` via `PlayerRef` and call `seekTo(durationInFrames - 1)`.

```tsx
<Player
  loop={false}
  moveToBeginningWhenEnded={false}
  ...
/>
```

## Holding on the final frame

- The primary built-in mechanism is `moveToBeginningWhenEnded={false}`.
- `initialFrame` sets only the mount-time start frame and cannot be changed after mount.
- Imperative frame control is available via `PlayerRef.seekTo(frame)`.
- `renderPoster` + `showPosterWhenEnded` is available, but `showPosterWhenEnded` requires `moveToBeginningWhenEnded={false}`. This is useful for an end overlay/poster, not as the main way to keep playback from rewinding.
- `posterFillMode="composition-size"` is the relevant option if you use a freeze-frame-like poster that should scale like the composition.

## Autoplay behavior

- Remotion docs discourage `autoPlay` if the composition contains audio because browsers may block autoplay.
- For custom controls, start playback from a user gesture and pass the event into `playerRef.current?.play(e)` or `.toggle(e)`.
- Docs recommend `onClickCapture` instead of `onClick` for Safari.
- `initiallyMuted` is useful when the player must autoplay regardless of browser autoplay policy.
- Delayed media with audio may still hit autoplay restrictions; `numberOfSharedAudioTags` helps with delayed `Html5Audio`, while video tags with sound may need `onAutoPlayError` handling.

## PlayerRef methods and events most relevant here

### Methods

- `play(event?)`
- `pause()`
- `toggle(event?)`
- `seekTo(frame)`
- `getCurrentFrame()`
- `isPlaying()`
- `getContainerNode()`
- `getScale()`
- `addEventListener()` / `removeEventListener()`

### Events

- `ended`: fire custom logic when playback finishes.
- `pause`: also fires on end.
- `frameupdate`: every frame during playback and seeking.
- `timeupdate`: throttled progress updates.
- `seeked`: seeking-only updates.
- `scalechange`: useful if layout responds to player scaling.

```tsx
const ref = useRef<PlayerRef>(null);

useEffect(() => {
  const player = ref.current;
  if (!player) return;

  const onEnded = () => {
    player.seekTo(durationInFrames - 1);
    player.pause();
  };

  player.addEventListener("ended", onEnded);
  return () => player.removeEventListener("ended", onEnded);
}, [durationInFrames]);
```

## Sizing and full-bleed hero guidance

- The Player size is driven by `compositionWidth` / `compositionHeight`, then by `style.width` / `style.height` if provided.
- Official sizing docs show `style={{width: '100%'}}` for responsive scaling.
- Official container-fitting guidance uses a positioned wrapper with `aspectRatio`, `maxWidth: '100%'`, and `maxHeight: '100%'` - effectively a contain-style fit.
- There is no documented built-in `cover` prop for `<Player>` sizing.
- For a full-bleed hero/background, use CSS around the Player: an absolutely positioned wrapper, `overflow: hidden` on the hero, and size by width or height depending on which dimension must overfill.
- `getScale()` / `scalechange` can help if you need responsive logic tied to how much the composition is being scaled.

### Docs-backed contain pattern

```tsx
<div style={{position: 'relative', width: '100%', height: '100vh', overflow: 'hidden'}}>
  <div
    style={{
      position: 'absolute',
      inset: 0,
      margin: 'auto',
      aspectRatio: `${compositionWidth} / ${compositionHeight}`,
      maxWidth: '100%',
      maxHeight: '100%',
    }}
  >
    <Player style={{width: '100%'}} ... />
  </div>
</div>
```

### Practical hero/background pattern to get cover behavior

- Use the same absolutely positioned wrapper idea, but instead of `maxWidth` + `maxHeight`, compute whether to lock by height or width so one axis intentionally overflows.
- Keep `overflow: hidden` on the hero container.
- In practice this is CSS/layout work around the Player rather than a Remotion-specific Player prop.

## Most relevant API choices for this homepage hero

- `loop={false}`
- `moveToBeginningWhenEnded={false}`
- `initiallyMuted` if autoplay matters
- `ref={playerRef}` with `seekTo()`, `pause()`, `play(e)`
- `ended` event for custom final-frame logic
- responsive `style` plus a wrapper for full-bleed layout

## Source pages used

- https://www.remotion.dev/docs/player/player
- https://www.remotion.dev/docs/player/autoplay
- https://www.remotion.dev/docs/player/scaling
